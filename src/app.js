const express=require('express')
require('dotenv').config();
const mongoose = require('mongoose');

const app=express()
const port=process.env.PORT
require('./db/mongoose')
app.use(express.json())

const reporter=require('./Routers/Reporter')
app.use(reporter)

const news=require('./Routers/News')
app.use(news)

