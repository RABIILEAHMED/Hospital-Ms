import mongoose from "mongoose"

const testSchema = new mongoose.Schema({
  item: String,
  reference: String,
  unit: String,
  result: {
    type: String,
    default: ""
  }
})

const labQueueSchema = new mongoose.Schema({

  patient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Patient",
    required:true
  },

  doctor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Doctor"
  },

  invoice:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Invoice"
  },

  /* 🆕 tests ka laga qaaday */
  tests:[testSchema],

  /* 🆕 lacagta info */
  total:Number,
  paymentMethod:String,

  /* 🆕 result info */
  notes:String,
  authorizedBy:String,

  /* 🆕 PDF */
  reportFile:String,

  status:{
    type:String,
    enum:["waiting","processing","completed"],
    default:"waiting"
  }

},{timestamps:true})

export default mongoose.model("LabQueue",labQueueSchema)