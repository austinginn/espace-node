import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express();
const server = http.Server(app);
dotenv.config();
app.use('/static', express.static(__dirname + "/static"));

///HTTP client listen on 3000
server.listen(3000, function () {
    console.log('client server listening on 3000')
});

//////////////
//API//
//////////////
import apiRouter from './routes/api.mjs';
app.use('/api', apiRouter);


