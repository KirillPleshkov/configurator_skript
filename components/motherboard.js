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

const UpdateURL = async (parsingId) => {

    const URL = 'https://n-katalog.ru/category/materinskie-platy/list?sort=PriceAsc'

    try {
        const browser = await puppeteer.launch({headless: "new", args: minimal_args})
        const page = await browser.newPage()
        await page.goto(URL)


        await page.click('#preset_t_Socket > em')
        await page.waitForTimeout(1000)
        await page.click('#presetSocket > li:nth-child('+parsingId.toString()+')')

        await page.waitForTimeout(1000)
        await page.click('#tt-info > div.arrow-start > a')
        await page.waitForTimeout(1000)

        const url = page.url()

        await page.close()
        await browser.close()

        return url
    } catch (e) {
        throw e
    }
}

const main = async () => {
    const result = await pool.query('SELECT * FROM motherboard;')

    result.rows.map(async (element) => {

        const response = await isNormalUrl(element.url)
        if (response === false) {
            const newUrl = await UpdateURL(element.parserId)
            console.log(newUrl)
            await pool.query('UPDATE motherboard SET url= $1 WHERE id= $2;', [newUrl, element.id])
        }

    })

}

export const SetMotherboard = () => {
    main().then(r => console.log(r))
}