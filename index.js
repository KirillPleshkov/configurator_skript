import {SetRam} from "./components/ram.js";
import {SetDataStorage} from "./components/data-storage.js";
import {SetProcessorCooling} from "./components/processor-cooling.js";
import {SetPowerSupply} from "./components/power-supply.js";
import {SetMotherboard} from "./components/motherboard.js";
import {SetVideoCard} from "./components/vodeo-card.js";
import {SetProcessor1, SetProcessor2, SetProcessor3} from "./components/processor.js";


const main = async () => {

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // SetProcessorCooling()
    // await sleep(20000)
    // SetRam()
    // await sleep(20000)
    // SetDataStorage()
    // await sleep(20000)
    // SetPowerSupply()
    // await sleep(25000)
    // SetMotherboard()
    // await sleep(60000)
    // SetVideoCard()
    // await sleep(60000)
    // SetProcessor1()
    // await sleep(60000)
    SetProcessor2()
    await sleep(70000)
    SetProcessor3()
    // while (true) {
    //     SetProcessorCooling()
    //     await sleep(60000)
    //     SetRam()
    //     await sleep(60000)
    //     SetDataStorage()
    //     await sleep(60000)
    //     SetPowerSupply()
    //     await sleep(60000)
    //     SetMotherboard()
    //     await sleep(60000)
    //     SetVideoCard()
    //     await sleep(60000)
    //     SetProcessor()
    //     await sleep(60000)
    // }
}

main()

