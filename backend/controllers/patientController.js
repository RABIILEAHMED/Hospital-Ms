import Patient from "../models/Patient.js"


/* CREATE PATIENT */

export const createPatient = async(req,res)=>{

try{

const patient = await Patient.create(req.body)

res.json(patient)

}catch(err){

res.status(500).json({message:"Error creating patient"})

}

}


/* GET ALL PATIENTS */

export const getPatients = async(req,res)=>{

try{

const patients = await Patient.find()

res.json(patients)

}catch(err){

res.status(500).json({message:"Error fetching patients"})

}

}


/* GET SINGLE PATIENT */

export const getPatientById = async(req,res)=>{
try{

const patient = await Patient.findById(req.params.id)

if(!patient){
return res.status(404).json({message:"Patient not found"})
}

res.json(patient)

}catch(err){

console.log(err) // muhiim
res.status(500).json({message:"Error fetching patient"})

}
}