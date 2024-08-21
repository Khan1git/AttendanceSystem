import mongoose from 'mongoose'


const ConnectToDb = async()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/AttendanceSystemDb').then(()=>{
            console.log('Connected to the database successfully')
        })        
    } catch (error) {
        console.log('Filed to connect to the database')
    }
}

export default ConnectToDb