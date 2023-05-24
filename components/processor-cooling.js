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

const UpdateURL = async (parsingId, typeParsingId) => {

    try {
        const browser = await puppeteer.launch({ headless: "new", executablePath: executablePath() })
        const page = await browser.newPage()
        await page.goto('https://n-katalog.ru/category/sistemy-oxlazhdeniya/list?sort=PriceAsc', { waitUntil: 'domcontentloaded' })

        await page.waitForSelector('#presetNaznachenie > li:nth-child(3)')

        await page.click('#presetNaznachenie > li:nth-child(3)')
        await page.click('#presetTip > li:nth-child('+typeParsingId.toString()+')')
        await page.waitForTimeout(300)
        await page.click('#presetVentilyatorov > li:nth-child('+parsingId.toString()+')')

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



    const result = await pool.query('SELECT * FROM "processor-cooling";')

    result.rows.map(async (element) => {

        await sleep(1000)

        // const response = await isNormalUrl(element.url)
        //
        // if (response === false) {
            try {
                const type = await pool.query('SELECT * FROM "type-processor-cooling" WHERE id= $1;', [element.typeId])

                const newUrl = await UpdateURL(element.parserId, type.rows[0].parserId)
                console.log(newUrl)

                await pool.query('UPDATE "processor-cooling" SET url= $1 WHERE id= $2;', [newUrl, element.id])
            }
            catch (e){
                console.log(e)
            }

        // }

    })
}

export const SetProcessorCooling = () => {
    main().then(r => console.log(r))
}