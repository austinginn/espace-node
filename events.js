import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express();
dotenv.config();


// ///////
// //GUI//
// ///////
// import { router as guiRouter } from './routes/gui.mjs';
// app.use('/', guiRouter);

//////////////
//Public API//
//////////////
import apiRouter from './routes/api.mjs';
app.use('/api', apiRouter);


