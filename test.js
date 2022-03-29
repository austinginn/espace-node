import Espace from "./espace-node.mjs";
import fetch from "node-fetch";





console.log(Espace);


// let es = Espace("aginn@afumc.org", "uRWTMehMG$4dcEU","AFUMC");



// console.log(es);



//Fetch GET request wrapper and error handling
const get = async url => {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Basic YWdpbm5AYWZ1bWMub3JnOnVSV1RNZWhNRyQ0ZGNFVQ=='
            },
        });
        // const status = checkStatus(await response.status());
        const data = await response.json();
        // console.log(status);
        // console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
}

let result = await get("https://api.espace.cool/api/v1/event/list?nextDays=10000&publicOnly=true");

 console.log(result.Data.length);