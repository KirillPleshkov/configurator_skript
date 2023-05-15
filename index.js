import {SetRam} from "./components/ram.js";
import {SetDataStorage} from "./components/data-storage.js";



const main = async () => {
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    await SetRam()
    await SetDataStorage()

    // while (true) {
    //     SetRam()
    //     await sleep(10000)
    // }
}

main()

