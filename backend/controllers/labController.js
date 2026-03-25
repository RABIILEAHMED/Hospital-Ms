import LabQueue from "../models/LabQueue.js"
import Patient from "../models/Patient.js"
import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"

/* ===========================
GET QUEUE
=========================== */
export const getLabQueue = async(req,res)=>{
  const queue = await LabQueue
    .find()
    .populate("patient")
    .populate("doctor")

  res.json(queue)
}

/* ===========================
START PROCESS
=========================== */
export const startProcessing = async(req,res)=>{
  const lab = await LabQueue.findByIdAndUpdate(
    req.params.id,
    {status:"processing"},
    {returnDocument:"after"}
  )

  res.json(lab)
}

/* ===========================
SUBMIT RESULT
=========================== */
export const submitLabResult = async(req,res)=>{
  try{

    const {results,notes,authorizedBy} = req.body

    const lab = await LabQueue
      .findById(req.params.id)
      .populate("patient")

    if(!lab) return res.status(404).json({message:"Not found"})

    lab.status = "completed"
    lab.tests = results || []
    lab.notes = notes
    lab.authorizedBy = authorizedBy

    /* PDF GENERATION */
    const dir = "./reports"
    if(!fs.existsSync(dir)) fs.mkdirSync(dir)

    const filePath = path.join(dir,`report-${lab._id}.pdf`)

    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream(filePath))

    doc.fontSize(20).text("LAB REPORT",{align:"center"})
    doc.moveDown()

    doc.text(`Patient: ${lab.patient.fullName}`)
    doc.text(`Date: ${new Date().toLocaleDateString()}`)
    doc.moveDown()

    lab.tests.forEach(t=>{
      doc.text(`${t.item} : ${t.result}`)
    })

    if(notes) doc.moveDown().text(`Notes: ${notes}`)
    doc.moveDown().text(`Authorized By: ${authorizedBy}`)

    doc.end()

    lab.reportFile = filePath
    await lab.save()

    /* SAVE TO PATIENT */
    await Patient.findByIdAndUpdate(
      lab.patient._id,
      {
        $push:{
          labResults:{
            tests: lab.tests,
            notes,
            authorizedBy,
            file:filePath,
            date:new Date()
          }
        }
      }
    )

    res.json({message:"Completed successfully"})

  }catch(err){
    console.log(err)
    res.status(500).json({message:"Error"})
  }
}

/* ===========================
DOWNLOAD PDF
=========================== */
export const downloadLabPDF = async(req,res)=>{
  const lab = await LabQueue.findById(req.params.id)

  if(!lab || !lab.reportFile){
    return res.status(404).json({message:"No file"})
  }

  res.download(lab.reportFile)
}