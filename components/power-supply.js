import {pool} from "../db.js";
import axios from 'axios'
import puppeteer from 'puppeteer'
import {minimal_args} from "../puppeteer_config.js";

const isNormalUrl = async (url) => {

    try {
        const response = await axios.get(url)
        return true
    }
    catch (e) {
        return false
    }
}

const UpdateURL = async (power) => {

    const URL = 'https://n-katalog.ru/category/bloki-pitaniya/list?sort=PriceAsc'

    try {
        const browser = await puppeteer.launch({headless: "new", args: minimal_args})
        const page = await browser.newPage()
        await page.goto(URL)

        await page.type('#cMoshhnostMin', power.toString())
        await page.type('#cMoshhnostMax', power.toString())
        await page.waitForTimeout(2000)

        await page.click('#presetFormFaktor > li:nth-child(1) > label')
        await page.waitForTimeout(1000)
        await page.click('#presetFormFaktor > li:nth-child(1) > label')
        await page.waitForTimeout(1000)

        await page.click('#tt-info > div.arrow-start > a')

        const url = page.url()

        await page.close()
        await browser.close()

        return url
    } catch (e) {
        throw e
    }
}

const main = async () => {
    const result = await pool.query('SELECT * FROM "power-supply";')

    result.rows.map(async (element) => {

        const response = await isNormalUrl(element.url)
        if (response === false) {
            const newUrl = await UpdateURL(element.power)
            console.log(newUrl)
            await pool.query('UPDATE "power-supply" SET url= $1 WHERE id= $2;', [newUrl, element.id])
        }

    })
}

export const SetPowerSupply = () => {
    main().then(r => console.log(r))
}