import {SetRam} from "./components/ram.js";
import {SetDataStorage} from "./components/data-storage.js";
import {SetProcessorCooling} from "./components/processor-cooling.js";
import {SetPowerSupply} from "./components/power-supply.js";
import {SetMotherboard} from "./components/motherboard.js";
import {SetVideoCard} from "./components/vodeo-card.js";
import {SetProcessor} from "./components/processor.js";


const main = async () => {

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    while (true) {
        SetProcessorCooling()
        await sleep(15000)
        SetRam()
        await sleep(15000)
        SetDataStorage()
        await sleep(15000)
        SetPowerSupply()
        await sleep(15000)
        SetMotherboard()
        await sleep(15000)
        SetVideoCard()
        await sleep(15000)
        SetProcessor()
        await sleep(15000)
    }
}

main()

