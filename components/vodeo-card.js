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

    const URL = 'https://n-katalog.ru/category/videokarty/list?sort=PriceAsc'

    try {
        const browser = await puppeteer.launch({headless: "new", args: minimal_args})
        const page = await browser.newPage()
        await page.goto(URL)

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

const main = async () => {

    const result = await pool.query('SELECT * FROM "video-card";')

    result.rows.map(async (element) => {

        const response = await isNormalUrl(element.url)
        if (response === false) {
            const newUrl = await UpdateURL(element.parserId)
            console.log(newUrl)
            await pool.query('UPDATE "video-card" SET url= $1 WHERE id= $2;', [newUrl, element.id])
        }

    })
}

export const SetVideoCard = () => {
    main().then(r => console.log(r))
}