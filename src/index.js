import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import chalk from 'chalk'
import routes from './routes/routes.js'
dotenv.config()

const app = express()
const PORT = 9090;

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MongoDBUtrl)
.then(()=> console.log(chalk.green("MONGODB CONNECTED SUCCESSFULLY")))
.catch((err) => console.log(chalk.red("MONGODB CONNECTION FAILED :" + err.message)))

app.use('/', routes)

app.listen (PORT, () => console.log(chalk.blue(`server is running on port ${PORT}`)))