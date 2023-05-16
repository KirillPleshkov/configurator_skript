import {SetRam} from "./components/ram.js";
import {SetDataStorage} from "./components/data-storage.js";
import {SetProcessorCooling} from "./components/processor-cooling.js";



const main = async () => {
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    SetProcessorCooling()
    SetRam()
    SetDataStorage()

    // while (true) {
    //     SetRam()
    //     await sleep(10000)
    // }
}

main()

