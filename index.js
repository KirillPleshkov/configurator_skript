import {SetRam} from "./components/ram.js";
import {SetDataStorage} from "./components/data-storage.js";
import {SetProcessorCooling} from "./components/processor-cooling.js";
import {SetPowerSupply} from "./components/power-supply.js";



const main = async () => {
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // SetProcessorCooling()
    // await sleep(4000)
    // SetRam()
    // await sleep(4000)
    // SetDataStorage()

    SetPowerSupply()

    // while (true) {
    //     SetRam()
    //     await sleep(10000)
    // }
}

main()

