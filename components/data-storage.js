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

const UpdateURL = async (parsingId, URL) => {

    try {
        const browser = await puppeteer.launch({headless: "new", args: minimal_args})
        const page = await browser.newPage()
        await page.goto(URL)

        await page.click('#preset_t_Obem')
        await page.click('#presetObem > li:nth-child('+parsingId+')')

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


export const SetDataStorage = async () => {

    let isUpdate = false

    const result = await pool.query('SELECT * FROM "data-storage";')

    result.rows.map(async (element) => {

        const type = await pool.query('SELECT * FROM "type-data-storage" WHERE id= $1;', [element.typeId])

        const response = await isNormalUrl(element.url)
        if (response === false) {
            isUpdate = true
            const newUrl = await UpdateURL(element.parsingId, type.rows[0].url)
            console.log(newUrl)
            await pool.query('UPDATE "data-storage" SET url= $1 WHERE id= $2;', [newUrl, element.id])
        }

    })

    return isUpdate

}