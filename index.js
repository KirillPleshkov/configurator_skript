import {SetRam} from "./components/ram.js";
import {SetDataStorage} from "./components/data-storage.js";
import {SetProcessorCooling} from "./components/processor-cooling.js";
import {SetPowerSupply} from "./components/power-supply.js";
import {SetMotherboard} from "./components/motherboard.js";
import {SetVideoCard} from "./components/vodeo-card.js";



const main = async () => {
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // SetProcessorCooling()
    //
    // SetRam()
    //
    // SetDataStorage()
    //
    // SetPowerSupply()
    //
    // SetMotherboard()

    SetVideoCard()

    await sleep(10000)

    // while (true) {
    //     SetRam()
    //     await sleep(10000)
    // }
}

main()

