
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

let publicEvents = getEvents("nextDays=60&publicOnly=true");


//Routes//
//GET public events
router.get('/events', (req, res) => {
    res.json(publicEvents);
});

router.post('/update', (req, res) => {
    publiceEvents = getEvents("nextDays=60&publicOnly=true");
})




//getEvents
async function getEvents(query){
    try {
        let events = await es.getEventList(query);
        return processData(events.Data);
    } catch(err){ console.log(err); }
}

//create new event array with only data we need
function processData(data) {
    let processedEvents = [];
    for (let i = 0; i < data.length; i++) {
        //ignore drafts
        if (data[i].status != "Draft") {
            let futureDates = []; //array to hold all future dates


            if (checkDate(data[i].EventDate)) {
                futureDates.push(data[i].EventDate);
            } //check if the Event date is current or greater

            for (let x = 0; x < data[i].AdditionalDates; x++) {
                if (checkDate(data[i].AdditionalDates[x])) {
                    futureDates.push(data[i].AdditionalDates[x]);
                }
            } //check if recurring dates are current or greater and push

            if (futureDates.length > 0) {
                //final assembly
                processedEvents.push({
                    "eventName": data[i].EventName,
                    "description": data[i].Description,
                    "startTime": data[i].StartTime,
                    "endTime": data[i].EndTime,
                    "dates": futureDates
                });
            }
        }
    }
    return processedEvents;
}

function checkDate(date) {
    let yo = new Date(date.substring(0, 10));
    console.log(yo);
    let current = new Date;
    current.setHours(0, 0, 0, 0);
    console.log(current.getTime());
    console.log(yo.getTime());
    if (yo.getTime() >= current.getTime()) {
        console.log("greater");
        return true;
    }

    return false;
}

export default router;