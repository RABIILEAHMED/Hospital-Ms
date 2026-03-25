import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema({

fullName: String,
phone: String,

status:{
type:String,
enum:["waiting","done","rejected"],
default:"waiting"
}

},{
timestamps:true
})

export default mongoose.model("DrTicket", ticketSchema)