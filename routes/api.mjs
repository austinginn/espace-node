
import Espace from "../espace-node.mjs";
import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();
const es = new Espace(process.env.USERNAME, process.env.SECRET);

const GET_EVENTS_QUERY = "nextDays=60&publicOnly=true";
const PUBLIC_EVENTS_REFRESH = 43200000; //12 hrs

let publicEvents = [];

//start public event interval
publicEvents = await getEvents(GET_EVENTS_QUERY);
setInterval(async () => {
    publicEvents =  await getEvents(GET_EVENTS_QUERY);
}, PUBLIC_EVENTS_REFRESH);



//Routes//
//GET public events
router.get('/events', (req, res) => {
    // console.log(publicEvents);
    res.json({ events: publicEvents });
});

//POST manual event update
//secured
router.post('/update', (req, res) => {
    publicEvents = getEvents("nextDays=60&publicOnly=true");
    console.log("refresh triggered by api/update");
    res.sendStatus(200);
})

//GET webhook update
//unsecure
router.get('/webhook', async (req, res) => {
    console.log("refresh triggered by api/webhook");
    res.sendStatus(200);
    publicEvents = await getEvents(GET_EVENTS_QUERY);
});

//POST webhook update
//unsecure
router.post('/webhook', async (req, res) => {
    console.log("refresh triggered by api/webhook POST");
    res.sendStatus(200);
    publicEvents = await getEvents(GET_EVENTS_QUERY);
});


//FUNCTIONS
//get events
async function getEvents(query) {
    try {
        let events = await es.getEventList(query);
        // console.log(events.Data[0]);
        return processData(events.Data);
    } catch (err) { console.log(err); }
}

//create new event array with only data we need
function processData(data) {
    let processedEvents = [];
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
        //ignore drafts
        if (data[i].EventStatus == "Approved") {
            // let futureDates = []; //array to hold all future dates
            let start = "";
            let spaces = []

            // console.log(data[].EventStart);

            if (checkDate(data[i].EventStart)) {
                start = data[i].EventStart;
            } //check if the Event date is current or greater

            // for (let x = 0; x < data[i].AdditionalDates.length; x++) {
            //     if (checkDate(data[i].AdditionalDates[x])) {
            //         futureDates.push(data[i].AdditionalDates[x]);
            //     }
            // } //check if recurring dates are current or greater and push
            for(let x = 0; x < data[i].Items.length; x++){
                if(data[i].Items[x].ItemType == 'Space'){
                    spaces.push(data[i].Items[x].Name);
                }
            }

            if (start != "") {
                //final assembly
                processedEvents.push({
                    "eventName": data[i].EventName,
                    "description": data[i].Description,
                    "start": data[i].EventStart,
                    "end": data[i].EventEnd,
                    "spaces": spaces,
                    "eventID": data[i].EventId
                });
            }
        }
    }
    return processedEvents;
}

function checkDate(date) {
    let yo = new Date(date.substring(0,10));
    // console.log(date.substring(0,9));
    // console.log(yo);
    let current = new Date;
    current.setHours(0, 0, 0, 0);
    
    // console.log(current.getTime());
    // console.log(yo.getTime());
    if (yo.getMonth() >= current.getMonth()  && yo.getFullYear() >= current.getFullYear()) {
        // console.log("greater");

        return true;
    }
    // console.log(current);
    // console.log(yo);
    return false;
}

export default router;