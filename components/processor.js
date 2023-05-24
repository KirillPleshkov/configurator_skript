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

const UpdateURL = async (socket, codeName) => {

    const URL = 'https://n-katalog.ru/category/processory/list?sort=PriceAsc'

    try {
        const browser = await puppeteer.launch({ headless: "new", executablePath: executablePath() })
        const page = await browser.newPage()
        await page.goto(URL)

        await page.waitForSelector('#preset_t_KodovoeNazvanie > em')

        await page.click('#preset_t_KodovoeNazvanie > em')
        await page.click('#presetKodovoeNazvanie > li:nth-child('+codeName+')')

        await page.waitForTimeout(1000)

        await page.click('#preset_t_Seriya > em')
        await page.click('#presetSeriya > li:nth-child('+socket+')')

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

const main1 = async () => {

    const result = await pool.query('SELECT * FROM processor;')

    result.rows.map(async (element) => {

            const response = await isNormalUrl(element.url)
            if (response === false && element.id < 10) {

                try {
                    const socket = await pool.query('SELECT * FROM "processor-series" WHERE id= $1;', [element.seriesId])
                    const codeName = await pool.query('SELECT * FROM "processor-code-name" WHERE id= $1;', [element.codeNameId])

                    const newUrl = await UpdateURL(socket.rows[0].parserId, codeName.rows[0].parserId)
                    console.log(newUrl)

                    await pool.query('UPDATE processor SET url= $1 WHERE id= $2;', [newUrl, element.id])
                } catch (e) {
                    console.log(e)
                }
            }

    })

}

const main2 = async () => {

    const result = await pool.query('SELECT * FROM processor;')

    result.rows.map(async (element) => {

        const response = await isNormalUrl(element.url)
        if (response === false && element.id < 20 && element.id >= 10) {

            try {
                const socket = await pool.query('SELECT * FROM "processor-series" WHERE id= $1;', [element.seriesId])
                const codeName = await pool.query('SELECT * FROM "processor-code-name" WHERE id= $1;', [element.codeNameId])

                const newUrl = await UpdateURL(socket.rows[0].parserId, codeName.rows[0].parserId)
                console.log(newUrl)

                await pool.query('UPDATE processor SET url= $1 WHERE id= $2;', [newUrl, element.id])
            } catch (e) {
                console.log(e)
            }
        }

    })

}

const main3 = async () => {

    const result = await pool.query('SELECT * FROM processor;')

    result.rows.map(async (element) => {

        const response = await isNormalUrl(element.url)
        if (response === false && element.id >= 20) {

            try {
                const socket = await pool.query('SELECT * FROM "processor-series" WHERE id= $1;', [element.seriesId])
                const codeName = await pool.query('SELECT * FROM "processor-code-name" WHERE id= $1;', [element.codeNameId])

                const newUrl = await UpdateURL(socket.rows[0].parserId, codeName.rows[0].parserId)
                console.log(newUrl)

                await pool.query('UPDATE processor SET url= $1 WHERE id= $2;', [newUrl, element.id])
            } catch (e) {
                console.log(e)
            }
        }

    })

}


export const SetProcessor1 = () => {
    main1().then(r => console.log(r))
}

export const SetProcessor2 = () => {
    main2().then(r => console.log(r))
}

export const SetProcessor3 = () => {
    main3().then(r => console.log(r))
}