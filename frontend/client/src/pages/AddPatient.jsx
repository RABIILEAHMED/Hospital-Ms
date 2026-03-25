import { useState } from "react"
import { motion } from "framer-motion"
import API from "../api/api"

export default function AddPatient(){

const [form,setForm] = useState({
fullName:"",
phone:"",
gender:"",
medicalHistory:""
})

const [message,setMessage] = useState("")
const [loading,setLoading] = useState(false)

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const handleSubmit = async(e)=>{

e.preventDefault()

setLoading(true)

try{

await API.post("/patients",form)

setMessage("✅ Patient added successfully")

setForm({
fullName:"",
phone:"",
gender:"",
medicalHistory:""
})

}catch(error){

setMessage("❌ Error adding patient")

}

setLoading(false)

}

return(

<div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

<motion.div
initial={{opacity:0,y:30}}
animate={{opacity:1,y:0}}
transition={{duration:0.5}}
className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-xl"
>

<h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
🦷 Add New Patient
</h2>

<form onSubmit={handleSubmit} className="space-y-5">

{/* Full Name */}

<div>

<label className="block mb-1 font-medium">
Full Name
</label>

<input
name="fullName"
placeholder="Enter patient full name"
value={form.fullName}
onChange={handleChange}
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
/>

</div>

{/* Phone */}

<div>

<label className="block mb-1 font-medium">
Phone Number
</label>

<input
name="phone"
placeholder="Enter phone number"
value={form.phone}
onChange={handleChange}
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
/>

</div>

{/* Gender */}

<div>

<label className="block mb-1 font-medium">
Gender
</label>

<select
name="gender"
value={form.gender}
onChange={handleChange}
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
>

<option value="">Select Gender</option>
<option value="male">Male</option>
<option value="female">Female</option>

</select>

</div>

{/* Medical History */}

<div>

<label className="block mb-1 font-medium">
Medical History
</label>

<textarea
name="medicalHistory"
placeholder="Enter medical history"
value={form.medicalHistory}
onChange={handleChange}
rows="4"
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
/>

</div>

{/* Submit */}

<motion.button
whileHover={{scale:1.05}}
whileTap={{scale:0.95}}
type="submit"
disabled={loading}
className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
>

{loading ? "Adding Patient..." : "Add Patient"}

</motion.button>

</form>

{/* Message */}

{message && (

<p className="text-center mt-4 text-gray-700">
{message}
</p>

)}

</motion.div>

</div>

)

}