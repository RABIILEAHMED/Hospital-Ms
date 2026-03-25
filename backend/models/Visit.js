import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
{
patient:{
type:mongoose.Schema.Types.ObjectId,
ref:"Patient",
required:true
},

dentist:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

treatment:{
type:String
},

toothNumber:{
type:String
},

notes:{
type:String
},

cost:{
type:Number
},

visitDate:{
type:Date,
default:Date.now
}

},
{timestamps:true}
);

export default mongoose.model("Visit",visitSchema);