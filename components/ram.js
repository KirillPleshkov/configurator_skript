import {pool} from "../db.js";
import axios from 'axios'
import puppeteer from 'puppeteer-extra'
import {executablePath} from 'puppeteer'
import {minimal_args} from "../puppeteer_config.js";

import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin())

const isNormalUrl = async (url) => {

    try {
        const browser = await puppeteer.launch({ headless: "new", executablePath: executablePath() })
        const page = await browser.newPage()
        await page.goto(URL)

        await page.waitForTimeout(5000)
        const elements = await page.$$('#chk_kingston-fury-kf437c19bbak216');

        return true
    }
    catch (e) {
        return false
    }
}

const UpdateURL = async (value) => {
    try {
        const browser = await puppeteer.launch({ headless: "new", executablePath: executablePath() })
        const page = await browser.newPage()
        await page.goto('https://n-katalog.ru/category/operativnaya-pamyat/list?sort=PriceAsc', { waitUntil: 'domcontentloaded' })

        await page.waitForSelector('#presetKolVoPlanokVKomplekte > li:nth-child(1) > label')

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

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const main = async () => {
    const result = await pool.query('SELECT * FROM ram;')

    result.rows.map(async (element) => {

        await sleep(1000)


        // const response = await isNormalUrl(element.url)
        // if (response === false) {
            try {
                const newUrl = await UpdateURL(Math.log2(element.totalVolume))
                console.log(newUrl)
                await pool.query('UPDATE ram SET url= $1 WHERE id= $2;', [newUrl, element.id])
            }
            catch (e){
                console.log(e)
            }

        // }

    })
}

export const SetRam = () => {
    main().then(r => console.log(r))
}