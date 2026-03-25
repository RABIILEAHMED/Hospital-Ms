import Visit from "../models/Visit.js"

export const addVisit = async(req,res)=>{

try{

const visit = await Visit.create({
patient:req.params.patientId,
dentist:req.user._id,
treatment:req.body.treatment,
toothNumber:req.body.toothNumber,
notes:req.body.notes,
cost:req.body.cost
})

res.status(201).json(visit)

}catch(error){

res.status(500).json({error:error.message})

}

}

export const getPatientVisits = async(req,res)=>{

try{

const visits = await Visit.find({patient:req.params.patientId})
.populate("dentist","name")

res.json(visits)

}catch(error){

res.status(500).json({error:error.message})

}

}