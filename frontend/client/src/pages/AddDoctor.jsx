import {useState} from "react"
import API from "../api/api"
import { motion } from "framer-motion"

export default function AddDoctor(){

const [form,setForm] = useState({
name:"",
email:"",
phone:"",
specialization:"",
experience:"",
startTime:"",
endTime:""
})

const [message,setMessage] = useState("")
const [loading,setLoading] = useState(false)

const handleChange = (e)=>{

setForm({
...form,
[e.target.name]:e.target.value
})

}

const submit = async(e)=>{

e.preventDefault()

console.log("Sending doctor:",form)

setLoading(true)

try{

await API.post("/doctors",form)

setMessage("✅ Doctor added successfully")

setForm({
name:"",
email:"",
phone:"",
specialization:"",
experience:"",
startTime:"",
endTime:""
})

}catch(err){

console.log("Error:",err.response?.data)

setMessage("❌ Error adding doctor")

}

setLoading(false)

}

return(

<div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

<motion.div
initial={{opacity:0,y:30}}
animate={{opacity:1,y:0}}
transition={{duration:0.4}}
className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-2xl"
>

<h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
👨‍⚕️ Add New Doctor
</h2>

<form onSubmit={submit} className="grid md:grid-cols-2 gap-5">

{/* Name */}

<div>
<label className="block text-sm font-medium mb-1">Name</label>
<input
name="name"
placeholder="Doctor Name"
value={form.name}
onChange={handleChange}
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
/>
</div>

{/* Email */}

<div>
<label className="block text-sm font-medium mb-1">Email</label>
<input
name="email"
placeholder="Doctor Email"
value={form.email}
onChange={handleChange}
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
/>
</div>

{/* Phone */}

<div>
<label className="block text-sm font-medium mb-1">Phone</label>
<input
name="phone"
placeholder="Phone Number"
value={form.phone}
onChange={handleChange}
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
/>
</div>

{/* Specialization */}

<div>
<label className="block text-sm font-medium mb-1">Specialization</label>
<input
name="specialization"
placeholder="e.g Orthodontist"
value={form.specialization}
onChange={handleChange}
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
/>
</div>

{/* Experience */}

<div>
<label className="block text-sm font-medium mb-1">Experience (years)</label>
<input
type="number"
name="experience"
placeholder="Years of experience"
value={form.experience}
onChange={handleChange}
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
/>
</div>

{/* Start Time */}

<div>
<label className="block text-sm font-medium mb-1">Start Time</label>
<input
name="startTime"
placeholder="09:00 AM"
value={form.startTime}
onChange={handleChange}
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
/>
</div>

{/* End Time */}

<div>
<label className="block text-sm font-medium mb-1">End Time</label>
<input
name="endTime"
placeholder="05:00 PM"
value={form.endTime}
onChange={handleChange}
className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
/>
</div>

{/* Submit Button */}

<div className="md:col-span-2">

<motion.button
whileHover={{scale:1.03}}
whileTap={{scale:0.97}}
type="submit"
disabled={loading}
className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
>

{loading ? "Adding Doctor..." : "Add Doctor"}

</motion.button>

</div>

</form>

{message && (
<p className="text-center mt-4 text-gray-700">
{message}
</p>
)}

</motion.div>

</div>

)

}