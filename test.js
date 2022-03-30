import Espace from "./espace-node.mjs";
import dotenv from 'dotenv';

dotenv.config();

let es = new Espace(process.env.USERNAME, process.env.SECRET);
let events = await es.getEventList();
console.log(events);


