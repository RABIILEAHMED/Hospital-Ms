import mongoose from "mongoose"

const testCatalogSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

price:{
type:Number,
required:true
}

})

export default mongoose.model("TestCatalog",testCatalogSchema)