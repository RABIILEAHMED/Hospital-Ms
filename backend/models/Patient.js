import mongoose from "mongoose"

const labResultSchema = new mongoose.Schema({
tests:[
{
item:String,
reference:String,
unit:String,
result:String
}
],
date:{
type:Date,
default:Date.now
}
})

const xraySchema = new mongoose.Schema({
imageUrl:String,
description:String,
date:{
type:Date,
default:Date.now
}
})

const patientSchema = new mongoose.Schema({

fullName:{
type:String,
required:true
},

phone:String,

address:String,

gender:String,

age:Number,

/* SYSTEM LINKS */

appointments:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"Appointment"
}
],

invoices:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"Invoice"
}
],

labResults:[labResultSchema],

xrayImages:[xraySchema],

createdAt:{
type:Date,
default:Date.now
}

})

export default mongoose.model("Patient",patientSchema)