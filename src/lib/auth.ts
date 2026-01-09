import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDb from "./db"
import Pharmacy from "@/models/pharmacyModel"
import bcrypt from "bcryptjs"

export const authOptions:NextAuthOptions={
   providers:[
    CredentialsProvider({
        name:"credentials",
        credentials:{
            email:{label:"Email",type:"text"},
            password:{label:"Password",type:"Password"}
        },
        
        async authorize(credentials, req) {
            let email = credentials?.email
            let password = credentials?.password

            if(!email || !password){
                return null
            }

            await connectDb()
            
             const pharmacy = await Pharmacy.findOne({
                email:credentials?.email
             })

             if(!pharmacy || !pharmacy.password) return null

            const isValid = await bcrypt.compare(password,pharmacy.password)

            if(!isValid) return null

            return{
                id:pharmacy._id.toString(),
                email:pharmacy.email,
                name:pharmacy.name
            }

        },

    })
   ],
   callbacks:{

   },
   session:{
         strategy:"jwt"
   },
   pages:{

   },
     secret: process.env.NEXTAUTH_SECRET,

}