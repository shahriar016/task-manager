const express = require("express")
require("./db/mongoose")
global.mongoose = require("mongoose")
const { ObjectId } = require("mongodb")
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")
const auth = require("./middlewares/auth")

const app = express()

app.use(express.json()) // activate json in the application
app.use(userRouter)
app.use(taskRouter)


module.exports = app