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

const UpdateURL = async (parsingId, typeParsingId) => {

    try {
        const browser = await puppeteer.launch({headless: "new", args: minimal_args})
        const page = await browser.newPage()
        await page.goto('https://n-katalog.ru/category/sistemy-oxlazhdeniya/list?sort=PriceAsc', { waitUntil: 'domcontentloaded' })

        await page.waitForTimeout(300)

        await page.click('#presetNaznachenie > li:nth-child(3)')
        await page.click('#presetTip > li:nth-child('+typeParsingId.toString()+')')
        await page.waitForTimeout(300)
        await page.click('#presetVentilyatorov > li:nth-child('+parsingId.toString()+')')
        //await page.click(' #presetVentilyatorov > li:nth-child('+parsingId.toString()+') > label')

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

const main = async () => {

    const result = await pool.query('SELECT * FROM "processor-cooling";')

    result.rows.map(async (element) => {

        const response = await isNormalUrl(element.url)

        if (response === false) {

            const type = await pool.query('SELECT * FROM "type-processor-cooling" WHERE id= $1;', [element.typeId])

            const newUrl = await UpdateURL(element.parserId, type.rows[0].parserId)
            console.log(newUrl)

            await pool.query('UPDATE "processor-cooling" SET url= $1 WHERE id= $2;', [newUrl, element.id])
        }

    })
}

export const SetProcessorCooling = () => {
    main().then(r => console.log(r))
}