import { connect } from "mongoose";


const MONGO_URI = process.env.MONGO_URI

if(!MONGO_URI){
    throw new Error("MONGO URI is not foud")
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose={conn:null,promise:null}
}

const connectDb = async ()=>{

    if(cached.conn){
        console.log("Datbase conncected with cached")
        return cached.conn
    }

    if(!cached.promise){
        cached.promise = connect(MONGO_URI).then((c)=>c.connection)
    }
    
    try {
        cached.conn = await cached.promise
        console.log("Datbase connected with promise")
    } catch (error) {
        throw error
    }

   return cached.conn
}

export default connectDb