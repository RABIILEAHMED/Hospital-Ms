import mongoose from "mongoose"

const invoiceItemSchema = new mongoose.Schema({
  testName: String,
  price: Number
})

const invoiceSchema = new mongoose.Schema({

  patient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Patient"
  },

  items:[invoiceItemSchema],

  total:Number,

  discount:{
    type:Number,
    default:0
  },

  finalAmount:Number,

  /* 🆕 PAYMENT METHOD */
  paymentMethod:{
    type:String,
    enum:["cash","zaad","edahab"],
    required:true
  },

  /* 🆕 PAYMENT STATUS */
  paymentStatus:{
    type:String,
    enum:["paid","pending"],
    default:"paid"
  }

},{timestamps:true})

export default mongoose.model("Invoice",invoiceSchema)