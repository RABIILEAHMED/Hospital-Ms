import { useState } from "react"
import API from "../api/api"
import { motion } from "framer-motion"

export default function PublicTicketForm(){

const [form,setForm] = useState({
  name:"",
  age:"",
  gender:"",
  phone:"",
  address:""
})

const [loading,setLoading] = useState(false)
const [success,setSuccess] = useState(null)
const [error,setError] = useState("")

const handleChange = (e)=>{
  setForm({...form,[e.target.name]:e.target.value})
}

const handleSubmit = async (e)=>{
  e.preventDefault()

  try{
    setLoading(true)
    setError("")
    setSuccess(null)

    const res = await API.post("/tickets",form)

    setSuccess(res.data)

    // reset form
    setForm({
      name:"",
      age:"",
      gender:"",
      phone:"",
      address:""
    })

  }catch(err){
    setError(err.response?.data?.message || "Something went wrong")
  }finally{
    setLoading(false)
  }
}

return(

<motion.div
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg border"
>

<h2 className="text-xl font-bold mb-4 text-center">
📝 Get Your Ticket
</h2>

<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

<input
name="name"
value={form.name}
onChange={handleChange}
placeholder="Full Name"
className="p-3 border rounded-lg"
required
/>

<input
name="age"
type="number"
value={form.age}
onChange={handleChange}
placeholder="Age"
className="p-3 border rounded-lg"
required
/>

<select
name="gender"
value={form.gender}
onChange={handleChange}
className="p-3 border rounded-lg"
required
>
<option value="">Select Gender</option>
<option value="male">Male</option>
<option value="female">Female</option>
</select>

<input
name="phone"
value={form.phone}
onChange={handleChange}
placeholder="Phone Number"
className="p-3 border rounded-lg"
required
/>

<input
name="address"
value={form.address}
onChange={handleChange}
placeholder="Address (optional)"
className="p-3 border rounded-lg md:col-span-2"
/>

<button
type="submit"
disabled={loading}
className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
>
{loading ? "Creating Ticket..." : "🎫 Get Ticket"}
</button>

</form>

{/* SUCCESS */}
{success && (
<div className="mt-5 p-4 bg-green-100 text-green-700 rounded-lg text-center">

<p className="font-bold text-lg">
✅ Ticket Created Successfully
</p>

<p className="text-2xl font-bold mt-2">
#{success.ticketNumber}
</p>

<p className="text-sm mt-1">
Please wait for your turn
</p>

</div>
)}

{/* ERROR */}
{error && (
<p className="text-red-500 mt-3 text-center">
{error}
</p>
)}

</motion.div>

)
}