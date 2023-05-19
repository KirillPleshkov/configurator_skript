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

const UpdateURL = async (value) => {
    try {
        const browser = await puppeteer.launch({headless: "new", args: minimal_args})
        const page = await browser.newPage()
        await page.goto('https://n-katalog.ru/category/operativnaya-pamyat/list?sort=PriceAsc', { waitUntil: 'domcontentloaded' })

        await page.click('#presetKolVoPlanokVKomplekte > li:nth-child(1) > label')
        await page.click('#presetTipPamyati > li:nth-child(2) > label')
        await page.click('#presetObemPamyatiKomplekta > li:nth-child(' + value + ') > label')

        await page.waitForTimeout(1000)
        await page.click('#tt-info > div.arrow-start > a')
        await page.waitForTimeout(1000)

        const URL = page.url()

        await page.close()
        await browser.close()

        return URL
    } catch (e) {
        throw e
    }
}


export const SetRam = async () => {

    let isUpdate = false

    const result = await pool.query('SELECT * FROM ram;')

    result.rows.map(async (element) => {
        const response = await isNormalUrl(element.url)
        if (response === false) {
            isUpdate = true
            const newUrl = await UpdateURL(Math.log2(element.totalVolume))
            console.log(newUrl)
            await pool.query('UPDATE ram SET url= $1 WHERE id= $2;', [newUrl, element.id])
        }

    })

    return isUpdate
}