import ConnectToDb from "./db/connect.js";
import express from 'express'
import cors from 'cors'
import router from "./routes/route.js";
import dotenv from 'dotenv'

const app = express()
const PORT = 3000
dotenv.config()
app.use(cors())
app.use(express.json())
ConnectToDb()

app.use('/api', router)


app.listen(PORT, (()=>{
    console.log("The server is running at port 3000")
}))