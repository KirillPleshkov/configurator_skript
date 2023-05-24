import {pool} from "../db.js";
import axios from 'axios'
import puppeteer from 'puppeteer-extra'
import {executablePath} from 'puppeteer'
import {minimal_args} from "../puppeteer_config.js";

import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin())

const isNormalUrl = async (URL) => {

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

const UpdateURL = async (parsingId) => {

    const URL = 'https://n-katalog.ru/category/videokarty/list?sort=PriceAsc'

    try {
        const browser = await puppeteer.launch({ headless: "new", executablePath: executablePath() })
        const page = await browser.newPage()
        await page.goto(URL)

        await page.waitForSelector('#preset_t_ModelGpu > em')

        await page.click('#preset_t_ModelGpu > em')
        await page.click('#presetModelGpu > li:nth-child('+parsingId+')')

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

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const main = async () => {

    const result = await pool.query('SELECT * FROM "video-card";')

    result.rows.map(async (element) => {

        await sleep(1000)

        // const response = await isNormalUrl(element.url)
        // if (response === false) {
            try {
                const newUrl = await UpdateURL(element.parserId)
                console.log(newUrl)
                await pool.query('UPDATE "video-card" SET url= $1 WHERE id= $2;', [newUrl, element.id])
            }
            catch (e){
                console.log(e)
            }

        // }

    })
}

export const SetVideoCard = () => {
    main().then(r => console.log(r))
}