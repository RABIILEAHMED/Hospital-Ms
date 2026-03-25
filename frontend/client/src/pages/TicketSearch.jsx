import { useState, useEffect } from "react"
import API from "../api/api"
import socket from "../socket"
import { motion, AnimatePresence } from "framer-motion"

export default function TicketSearch(){

/* ================= STATE ================= */
const [query,setQuery] = useState("")
const [ticket,setTicket] = useState(null)
const [loading,setLoading] = useState(false)

const [waiting,setWaiting] = useState([])
const [current,setCurrent] = useState(null)
const [total,setTotal] = useState(0)

const [message,setMessage] = useState("")

/* ================= LOAD ================= */
const loadDashboard = async()=>{
  try{
    const waitingRes = await API.get("/tickets/waiting")
    const allRes = await API.get("/tickets")

    setWaiting(waitingRes.data)
    setTotal(allRes.data.length)

  }catch(err){
    console.log(err)
  }
}

/* ================= REALTIME ================= */
useEffect(()=>{
  loadDashboard()

  socket.on("ticketCreated", loadDashboard)
  socket.on("ticketUpdated", loadDashboard)

  return ()=>{
    socket.off("ticketCreated")
    socket.off("ticketUpdated")
  }
},[])

useEffect(()=>{

  if(!query) return

  const delay = setTimeout(()=>{
    searchTicket()
  },300)

  return ()=> clearTimeout(delay)

},[query])

/* ================= SEARCH ================= */
const searchTicket = async()=>{
  try{
    setLoading(true)
    const res = await API.get(`/tickets/search?query=${query}`)
    setTicket(res.data)
  }catch{
    setMessage("❌ Ticket not found")
    setTicket(null)
  }
  setLoading(false)
}

/* ================= ACTIONS ================= */

const acceptPatient = async(id)=>{
  try{
    await API.put(`/tickets/accept/${id}`)
    const selected = waiting.find(t=>t._id === id)
    setCurrent(selected)
    setMessage("✅ Patient accepted")
    loadDashboard()
  }catch{
    setMessage("❌ Accept failed")
  }
}

const rejectPatient = async(id)=>{
  try{
    await API.put(`/tickets/reject/${id}`)
    if(current?._id === id) setCurrent(null)
    setMessage("❌ Patient rejected")
    loadDashboard()
  }catch{
    setMessage("❌ Reject failed")
  }
}

const completePatient = async(id)=>{
  try{
    await API.put(`/tickets/complete/${id}`)
    setCurrent(null)

    const updatedWaiting = waiting.filter(t => t._id !== id)
    if(updatedWaiting.length > 0){
      setCurrent(updatedWaiting[0])
    }

    setMessage("✅ Patient completed")
    loadDashboard()
  }catch{
    setMessage("❌ Complete failed")
  }
}

/* ================= UI ================= */
return(

<div className="min-h-screen bg-gray-100 p-4 md:p-10">

<motion.h2
initial={{opacity:0,y:-20}}
animate={{opacity:1,y:0}}
className="text-2xl md:text-3xl font-bold mb-6"
>
👨‍⚕️ Doctor Dashboard
</motion.h2>

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
<p className="text-xl font-bold">{total}</p>
</div>

<div className="bg-white p-4 rounded-xl shadow">
<p className="text-sm text-gray-500">Waiting</p>
<p className="text-xl font-bold text-yellow-600">{waiting.length}</p>
</div>

<div className="bg-white p-4 rounded-xl shadow">
<p className="text-sm text-gray-500">Now Serving</p>
<p className="text-sm font-semibold">
{current ? current.name : "None"}
</p>
</div>

</div>

{/* CURRENT PATIENT */}
{current ? (

<motion.div
initial={{opacity:0,scale:0.95}}
animate={{opacity:1,scale:1}}
className="bg-white p-6 rounded-2xl shadow mb-6"
>

<h3 className="text-lg font-semibold mb-4">
🎯 Now Serving
</h3>

<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">

<p><b>Name:</b> {current.name}</p>
<p><b>Age:</b> {current.age}</p>
<p><b>Gender:</b> {current.gender}</p>
<p><b>Phone:</b> {current.phone}</p>
<p><b>Ticket:</b> #{current.ticketNumber}</p>
<p><b>Queue:</b> {current.queueNumber}</p>

</div>

<div className="flex gap-3 mt-5">

<button
onClick={()=>completePatient(current._id)}
className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
>
Done
</button>

<button
onClick={()=>rejectPatient(current._id)}
className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
>
Reject
</button>

</div>

</motion.div>

) : (

<div className="bg-yellow-100 p-5 rounded-xl text-center mb-6">
🚀 Select a patient from queue to start
</div>

)}

{/* WAITING LIST */}
<div className="bg-white p-5 rounded-2xl shadow mb-6">

<h3 className="font-semibold mb-4">📋 Waiting Queue</h3>

<div className="space-y-3">

{waiting.map(t=>(

<div key={t._id} className="flex justify-between items-center border p-3 rounded-lg">

<div>
<p className="font-medium">{t.name}</p>
<p className="text-xs text-gray-500">
Ticket #{t.ticketNumber} • Queue {t.queueNumber}
</p>
</div>

<button
onClick={()=>acceptPatient(t._id)}
className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
>
Accept
</button>

</div>

))}

{waiting.length === 0 && (
<p className="text-gray-500 text-sm">No patients waiting</p>
)}

</div>

</div>

{/* SEARCH */}
<div className="bg-white p-5 rounded-2xl shadow">

<h3 className="font-semibold mb-4">🔍 Quick Search</h3>

<div className="flex flex-col sm:flex-row gap-3">

<input
placeholder="Phone or ticket number"
value={query}
onChange={(e)=>setQuery(e.target.value)}
className="border p-3 rounded-lg flex-1"
/>

<button
onClick={searchTicket}
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
>
{loading ? "Searching..." : "Search"}
</button>

</div>

{ticket && (
<div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
<b>{ticket.name}</b> • Status: {ticket.status}
</div>
)}

</div>

</div>

)
}