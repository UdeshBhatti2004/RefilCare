import connectDb from "@/lib/db";
import Patient from "@/models/patientModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    
  try {
      await connectDb()
   
      const {pharmacyId,name,phone} = await req.json()

      if(!pharmacyId || !name || !phone){
         return NextResponse.json(
            {message:"All fields are required"},
            {status:400}
         )
      }


      const patient = await Patient.create({
          pharmacyId,
          name,
          phone
      })

      return NextResponse.json(
        patient,
        {status:201}
      )

  } catch (error) {
     console.error("Error in creating patient ",error)

     return NextResponse.json(
        {message:"Internal server error"},
        {status:500}
     )
  }

}