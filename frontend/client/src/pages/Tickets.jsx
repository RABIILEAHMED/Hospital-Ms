import { useState, useEffect } from "react"
import API from "../api/api"
import { motion, AnimatePresence } from "framer-motion"
import socket from "../socket"

export default function Tickets(){

/* ================= STATE ================= */
const [form,setForm] = useState({
  name:"",
  age:"",
  gender:"",
  phone:"",
  address:""
})

const [tickets,setTickets] = useState([])
const [loading,setLoading] = useState(false)
const [message,setMessage] = useState("")

/* ================= LOAD ================= */
const loadTickets = async()=>{
  try{
    const res = await API.get("/tickets")
    setTickets(res.data || []) // ✅ FIX
  }catch(error){
    console.log(error)
  }
}

/* ================= REALTIME ================= */
useEffect(()=>{

  loadTickets()

  /* 🔥 FIX: ENSURE SOCKET CONNECT */
  if(!socket.connected){
    socket.connect()
  }

  socket.on("ticketCreated",(ticket)=>{

    /* 🔥 FIX: PREVENT DUPLICATE */
    setTickets(prev => {
      const exists = prev.find(t => t._id === ticket._id)
      if(exists) return prev
      return [...prev, ticket]
    })

  })

  socket.on("ticketUpdated",(updated)=>{
    setTickets(prev =>
      prev.map(t => t._id === updated._id ? updated : t)
    )
  })

  /* 🔥 FIX: AUTO REFRESH (important after login) */
  const interval = setInterval(loadTickets, 5000)

  return ()=>{
    socket.off("ticketCreated")
    socket.off("ticketUpdated")
    clearInterval(interval) // ✅ cleanup
  }

},[])

/* ================= INPUT ================= */
const handleChange = (e)=>{
  const { name, value } = e.target

  setForm(prev => ({
    ...prev,
    [name]: value
  }))
}

/* ================= VALIDATION ================= */
const validate = ()=>{
  if(!form.name.trim()) return "Name is required"
  if(!form.age) return "Age is required"
  if(!form.gender) return "Gender is required"
  if(!form.phone.trim()) return "Phone is required"
  return null
}

const submit = async(e)=>{
  e.preventDefault()

  const error = validate()
  if(error){
    setMessage(`❌ ${error}`)
    return
  }

  try{
    setLoading(true)

    const payload = {
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone.trim(),
      address: form.address.trim()
    }

    const res = await API.post("/tickets",payload)

    setMessage(`🎫 Ticket #${res.data.ticketNumber} created`)

    setForm({
      name:"",
      age:"",
      gender:"",
      phone:"",
      address:""
    })

  }catch(error){

    setMessage(
      error?.response?.data?.message || "❌ Failed"
    )

  }

  setLoading(false)
}

/* ================= STATUS ================= */
const statusColor = (status)=>{
  if(status==="waiting") return "bg-yellow-100 text-yellow-700"
  if(status==="accepted") return "bg-blue-100 text-blue-700"
  if(status==="done") return "bg-green-100 text-green-700"
  if(status==="rejected") return "bg-red-100 text-red-700"
  return "bg-gray-100"
}

/* ================= STATS ================= */
const stats = {
  total: tickets.length,
  waiting: tickets.filter(t=>t.status==="waiting").length,
  done: tickets.filter(t=>t.status==="done").length
}

/* ================= UI ================= */
return(

<div className="min-h-screen bg-gray-100 p-4 md:p-10">

<h2 className="text-2xl md:text-3xl font-bold mb-6">
🎫 Ticket System (Live)
</h2>

{/* MESSAGE */}
<AnimatePresence>
{message && (
<motion.div
initial={{opacity:0,y:-10}}
animate={{opacity:1,y:0}}
exit={{opacity:0}}
className="mb-4 p-3 bg-white rounded-xl shadow"
>
{message}
</motion.div>
)}
</AnimatePresence>

{/* STATS */}
<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">

<div className="bg-white p-4 rounded-xl shadow">
<p className="text-sm text-gray-500">Total</p>
<p className="text-xl font-bold">{stats.total}</p>
</div>

<div className="bg-white p-4 rounded-xl shadow">
<p className="text-sm text-gray-500">Waiting</p>
<p className="text-xl font-bold text-yellow-600">{stats.waiting}</p>
</div>

<div className="bg-white p-4 rounded-xl shadow">
<p className="text-sm text-gray-500">Completed</p>
<p className="text-xl font-bold text-green-600">{stats.done}</p>
</div>

</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

{/* FORM */}
<form
onSubmit={submit}
className="bg-white p-6 rounded-2xl shadow space-y-4"
>

<h3 className="font-semibold text-lg">
Generate Ticket
</h3>

<input
className="border p-3 rounded-lg w-full"
name="name"
placeholder="Patient Name"
value={form.name}
onChange={handleChange}
/>

<input
className="border p-3 rounded-lg w-full"
name="age"
type="number"
placeholder="Age"
value={form.age}
onChange={handleChange}
/>

<select
name="gender"
value={form.gender}
onChange={handleChange}
className="border p-3 rounded-lg w-full"
>
<option value="">Select Gender</option>
<option value="male">Male</option>
<option value="female">Female</option>
</select>

<input
className="border p-3 rounded-lg w-full"
name="phone"
placeholder="Phone"
value={form.phone}
onChange={handleChange}
/>

<input
className="border p-3 rounded-lg w-full"
name="address"
placeholder="Address"
value={form.address}
onChange={handleChange}
/>

<button
disabled={loading}
className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
>
{loading ? "Creating..." : "Generate Ticket"}
</button>

</form>

{/* TABLE */}
<div className="bg-white rounded-2xl shadow overflow-hidden">

<div className="p-4 border-b flex justify-between">
<h3 className="font-semibold">Queue</h3>
<span className="text-sm text-gray-500">{tickets.length}</span>
</div>

<div className="overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-gray-50 text-gray-500">
<tr>
<th className="p-3 text-left">Patient</th>
<th>Ticket</th>
<th>Status</th>
<th>Time</th>
</tr>
</thead>

<tbody>

{tickets.map(t=>(

<tr key={t._id} className="border-t">

<td className="p-3">
<p className="font-medium">{t.name}</p>
<p className="text-xs text-gray-500">
{t.age} yrs • {t.gender}
</p>
</td>

<td className="font-bold text-blue-600">
#{t.ticketNumber}
</td>

<td>
<span className={`px-2 py-1 rounded-full text-xs ${statusColor(t.status)}`}>
{t.status}
</span>
</td>

<td className="text-xs text-gray-500">
{new Date(t.createdAt).toLocaleTimeString()}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

</div>

)
}