import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  item: String,
  result: String,
  reference: String,
  unit: String
})

const sectionSchema = new mongoose.Schema({
  sectionName: String,
  tests: [testResultSchema]
})

const labRequestSchema = new mongoose.Schema({

  patient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Patient",
    required:true
  },

  doctor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Doctor"
  },

  orderedTests:[
    {
      sectionName:String,
      tests:[
        {
          item:String,
          reference:String,
          unit:String
        }
      ]
    }
  ],

  results:[sectionSchema],

  status:{
    type:String,
    enum:["waiting","processing","completed"],
    default:"waiting"
  },

  notes:String,

  authorizedBy:String

},{timestamps:true})

export default mongoose.model("LabRequest",labRequestSchema)