import Ticket from "../models/Ticket.js"
import Patient from "../models/Patient.js"

/* GET TODAY QUEUE */
export const getTodayTickets = async(req,res)=>{
try{

const today = new Date()
today.setHours(0,0,0,0)

const tickets = await Ticket.find({
createdAt: { $gte: today },
status: "waiting"
}).sort({createdAt:1}) // FIFO

res.json(tickets)

}catch(err){
res.status(500).json({message:"Server error"})
}
}

/* ACCEPT TICKET */
export const acceptTicket = async(req,res)=>{
try{

const ticket = await Ticket.findById(req.params.id)

if(!ticket){
return res.status(404).json({message:"Ticket not found"})
}

/* 1. CREATE OR UPDATE PATIENT */

let patient = await Patient.findOne({ phone: ticket.phone })

if(!patient){
patient = new Patient({
fullName: ticket.fullName,
phone: ticket.phone
})
await patient.save()
}

/* 2. UPDATE TICKET STATUS */

ticket.status = "done"
await ticket.save()

/* 3. DELETE FROM QUEUE */

await ticket.deleteOne()

res.json({message:"Accepted & moved to patients"})

}catch(err){
console.log(err)
res.status(500).json({message:"Server error"})
}
}

/* REJECT TICKET */
export const rejectTicket = async(req,res)=>{
try{

const ticket = await Ticket.findById(req.params.id)

if(!ticket){
return res.status(404).json({message:"Ticket not found"})
}

ticket.status = "rejected"
await ticket.save()

await ticket.deleteOne()

res.json({message:"Rejected"})

}catch(err){
res.status(500).json({message:"Server error"})
}
}