import Doctor from "../models/Doctor.js"

/* CREATE */
export const createDoctor = async(req,res)=>{
try{

const { email } = req.body

/* ✅ CHECK DUPLICATE EMAIL */
const exists = await Doctor.findOne({ email })
if(exists){
return res.status(400).json({message:"Email already exists"})
}

const doctor = new Doctor(req.body)
await doctor.save()

res.status(201).json(doctor)

}catch(err){
console.log(err)
res.status(500).json({message:"Server error"})
}
}

/* GET ALL */
export const getDoctors = async(req,res)=>{
try{
const doctors = await Doctor.find().sort({createdAt:-1})
res.json(doctors)
}catch(err){
res.status(500).json({message:"Server error"})
}
}

/* UPDATE */
export const updateDoctor = async(req,res)=>{
try{

const doctor = await Doctor.findById(req.params.id)

if(!doctor){
return res.status(404).json({message:"Doctor not found"})
}

/* ✅ UPDATE SAFE */
Object.assign(doctor, req.body)

await doctor.save()

res.json(doctor)

}catch(err){
console.log(err)
res.status(500).json({message:"Server error"})
}
}

/* DELETE */
export const deleteDoctor = async(req,res)=>{
try{

const doctor = await Doctor.findById(req.params.id)

if(!doctor){
return res.status(404).json({message:"Doctor not found"})
}

await doctor.deleteOne()

res.json({message:"Deleted successfully"})

}catch(err){
res.status(500).json({message:"Server error"})
}
}