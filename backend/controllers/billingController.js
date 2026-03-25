import Patient from "../models/Patient.js"
import Invoice from "../models/Invoice.js"
import TestCatalog from "../models/TestCatalog.js"
import LabQueue from "../models/LabQueue.js"

/* ===========================
   SEARCH PATIENT
=========================== */
export const searchPatient = async(req,res)=>{
  try{
    const patient = await Patient.findOne({phone:req.query.phone})

    if(!patient){
      return res.status(404).json({message:"Patient not found"})
    }

    res.json(patient)

  }catch(err){
    console.log(err)
    res.status(500).json({message:"Search failed"})
  }
}

/* ===========================
   GET TESTS
=========================== */
export const getTests = async(req,res)=>{
  try{
    const tests = await TestCatalog.find()
    res.json(tests)
  }catch(err){
    res.status(500).json({message:"Failed to fetch tests"})
  }
}

/* ===========================
   CREATE INVOICE + SEND TO LAB
=========================== */
export const createInvoice = async(req,res)=>{
  try{

    const {patientId, items, paymentMethod, doctor} = req.body

    /* ===================
       VALIDATION
    ==================== */
    if(!patientId || !items || items.length === 0){
      return res.status(400).json({message:"Missing data"})
    }

    if(!paymentMethod){
      return res.status(400).json({message:"Select payment method"})
    }

    /* ===================
       CALCULATIONS
    ==================== */
    let total = 0

    items.forEach(i=>{
      total += i.price
    })

    let discount = 0
    if(total > 100){
      discount = total * 0.1
    }

    const finalAmount = total - discount

    /* ===================
       CREATE INVOICE
    ==================== */
    const invoice = await Invoice.create({
      patient: patientId,
      items,
      total,
      discount,
      finalAmount,
      paymentMethod,
      paymentStatus: "paid",
      doctor // optional haddii aad leedahay
    })

    /* ===================
       🔥 SEND TO LAB
    ==================== */
    if(invoice.paymentStatus === "paid"){

      const tests = items.map(item=>({
        item: item.name || "Test",
        reference: item.reference || "Normal",
        unit: item.unit || "",
        result: ""
      }))

      await LabQueue.create({
        patient: patientId,
        doctor: doctor || null,
        invoice: invoice._id,
        tests,
        total,
        paymentMethod,
        status: "waiting"
      })
    }

    res.json({
      message: "Payment successful & sent to lab",
      invoice
    })

  }catch(err){
    console.log(err)
    res.status(500).json({message:"Invoice failed"})
  }
}

/* ===========================
   GET PAYMENTS
=========================== */
export const getPayments = async(req,res)=>{
  try{
    const invoices = await Invoice
      .find({paymentStatus:"paid"})
      .populate("patient")
      .sort({createdAt:-1})

    res.json(invoices)

  }catch(err){
    res.status(500).json({message:"Failed to fetch payments"})
  }
}