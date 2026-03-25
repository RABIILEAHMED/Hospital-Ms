import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema({

fullName:{
type:String,
required:true
},

gender:{
type:String,
enum:["male","female"],
required:true
},

specialty:{
type:String,
required:true
},

phone:{
type:String,
required:true
},

email:{
type:String,
required:true,
unique:true
},

experience:{
type:Number,
default:0
},

qualification:{
type:String
},

address:{
type:String
},

availability:{
type:String,
enum:["Available","Busy","Off"],
default:"Available"
}

},{
timestamps:true
})

export default mongoose.model("Doctor",doctorSchema)