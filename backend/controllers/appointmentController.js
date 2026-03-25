import Appointment from "../models/Appointment.js"

/* CREATE */
export const createAppointment = async(req,res)=>{
try{

const appointment = new Appointment(req.body)
await appointment.save()

res.status(201).json(appointment)

}catch(err){
console.log(err)
res.status(500).json({message:"Server error"})
}
}

/* GET ALL */
export const getAppointments = async(req,res)=>{
try{

const appointments = await Appointment.find()
.populate("patient","fullName phone")
.populate("doctor","fullName specialty")
.sort({createdAt:-1})

res.json(appointments)

}catch(err){
res.status(500).json({message:"Server error"})
}
}

/* UPDATE STATUS */
export const updateAppointment = async(req,res)=>{
try{

const appointment = await Appointment.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
)

res.json(appointment)

}catch(err){
res.status(500).json({message:"Server error"})
}
}

/* DELETE */
export const deleteAppointment = async(req,res)=>{
try{

await Appointment.findByIdAndDelete(req.params.id)
res.json({message:"Deleted"})

}catch(err){
res.status(500).json({message:"Server error"})
}
}