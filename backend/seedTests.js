import mongoose from "mongoose"
import TestCatalog from "./models/TestCatalog.js"

mongoose.connect("mongodb://127.0.0.1:27017/dental-clinic")

const tests = [

{
name:"X-Ray",
price:20
},

{
name:"Blood Test",
price:10
},

{
name:"Stool Test",
price:25
},

{
name:"Dental Scan",
price:30
},

{
name:"Teeth Cleaning",
price:40
}

]

const seed = async()=>{

await TestCatalog.deleteMany()

await TestCatalog.insertMany(tests)

console.log("Tests inserted")

process.exit()

}

seed()