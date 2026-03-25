import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const users = [

{
name:"Admin",
email:"admin@test.com",
password: await bcrypt.hash("123456",10),
role:"admin"
},

{
name:"Dentist",
email:"dentist@test.com",
password: await bcrypt.hash("123456",10),
role:"dentist"
},

{
name:"Reception",
email:"reception@test.com",
password: await bcrypt.hash("123456",10),
role:"receptionist"
},

{
name:"Accountant",
email:"account@test.com",
password: await bcrypt.hash("123456",10),
role:"accountant"
},

{
name:"Lab Tech",
email:"lab@test.com",
password: await bcrypt.hash("123456",10),
role:"labTechnician"
}

];

await User.deleteMany();
await User.insertMany(users);

console.log("✅ Users seeded");
process.exit();