import { connect } from "mongoose";

const MONGO_URI = process.env.MONGO_URI


if(!MONGO_URI){
    throw new Error("MONGO URI is not found")
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose={conn:null,promise:null}
}

const connectDb = async ()=>{

    if(cached.conn){
        return cached.conn
    }

    if(!cached.promise){
        cached.promise = connect(MONGO_URI).then((c)=>{
            return c.connection;
        })
    }
    
    try {
        cached.conn = await cached.promise
    } catch (error:any) {
        console.error("Database connection failed:");
        throw error
    }

   return cached.conn
}

export default connectDb