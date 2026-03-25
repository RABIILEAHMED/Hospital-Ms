import { useEffect, useState } from "react"
import API from "../api/api"
import socket from "../socket"
import { motion, AnimatePresence } from "framer-motion"

export default function DoctorQueue(){

const [tickets,setTickets] = useState([])
const [message,setMessage] = useState("")

/* ================= LOAD ================= */
const fetchTickets = async()=>{
  try{
    const res = await API.get("/tickets/waiting")
    setTickets(res.data || [])
  }catch(err){
    console.log(err)
  }
}

/* ================= REALTIME ================= */
useEffect(()=>{

  fetchTickets()

  /* 🔥 FIX SOCKET */
  if(!socket.connected){
    socket.connect()
  }

  socket.on("ticketCreated",(ticket)=>{
    if(ticket.status === "waiting"){
      setTickets(prev => {
        const exists = prev.find(t => t._id === ticket._id)
        if(exists) return prev
        return [...prev, ticket]
      })
    }
  })

  socket.on("ticketUpdated",(updated)=>{
    setTickets(prev => {

      /* ❌ REMOVE IF DONE / REJECTED */
      if(updated.status === "done" || updated.status === "rejected"){
        return prev.filter(t => t._id !== updated._id)
      }

      /* 🔥 CHECK IF EXISTS */
      const exists = prev.find(t => t._id === updated._id)

      if(exists){
        return prev.map(t => t._id === updated._id ? updated : t)
      }else{
        /* 🔥 ADD IF NOT EXISTS (IMPORTANT FIX) */
        return [...prev, updated]
      }

    })
  })

  return ()=>{
    socket.off("ticketCreated")
    socket.off("ticketUpdated")
  }

},[])

/* ================= ACTIONS ================= */

const handleAccept = async(id)=>{
  try{
    await API.put(`/tickets/accept/${id}`)

    setMessage("✅ Patient accepted")

    setTickets(prev =>
      prev.map(t =>
        t._id === id ? { ...t, status:"accepted" } : t
      )
    )

  }catch{
    setMessage("❌ Accept failed")
  }
}

const handleDone = async(id)=>{
  try{
    await API.put(`/tickets/complete/${id}`)

    setMessage("✅ Patient completed")

    setTickets(prev => prev.filter(t => t._id !== id))

  }catch{
    setMessage("❌ Complete failed")
  }
}

const handleReject = async(id)=>{
  try{
    await API.put(`/tickets/reject/${id}`)

    setTickets(prev => prev.filter(t => t._id !== id))

    setMessage("❌ Patient rejected")
  }catch{
    setMessage("❌ Reject failed")
  }
}

/* ================= STATS ================= */
const stats = {
  total: tickets.length
}

/* ================= UI ================= */

return(

<div className="min-h-screen bg-gray-100 p-4 md:p-10">

<motion.h2
initial={{opacity:0,y:-20}}
animate={{opacity:1,y:0}}
className="text-2xl md:text-3xl font-bold mb-6"
>
👨‍⚕️ Doctor Queue (Live)
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
<div className="bg-white p-4 rounded-xl shadow mb-6">
<p className="text-gray-500 text-sm">Waiting Patients</p>
<p className="text-2xl font-bold text-blue-600">{stats.total}</p>
</div>

{/* DESKTOP */}
<div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">

<table className="w-full text-sm">

<thead className="bg-gray-50 text-gray-500">
<tr>
<th className="p-3">#</th>
<th>Name</th>
<th>Age</th>
<th>Ticket</th>
<th>Queue</th>
<th className="text-center">Action</th>
</tr>
</thead>

<tbody>

{tickets.length === 0 && (
<tr>
<td colSpan="6" className="text-center p-6 text-gray-500">
No waiting patients
</td>
</tr>
)}

{tickets.map((t,index)=>(

<tr key={t._id} className="border-t hover:bg-gray-50">

<td className="p-3">{index+1}</td>
<td className="font-medium">{t.name}</td>
<td>{t.age}</td>

<td className="text-blue-600 font-bold">
#{t.ticketNumber}
</td>

<td>{t.queueNumber}</td>

<td className="flex justify-center gap-2 p-3">

{/* WAITING */}
{t.status === "waiting" && (
<>
<button
onClick={()=>handleAccept(t._id)}
className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
>
Accept
</button>

<button
onClick={()=>handleReject(t._id)}
className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
>
Reject
</button>
</>
)}

{/* ACCEPTED */}
{t.status === "accepted" && (
<button
onClick={()=>handleDone(t._id)}
className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
>
Done
</button>
)}

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* MOBILE */}
<div className="md:hidden space-y-3">

{tickets.length === 0 && (
<p className="text-center text-gray-500">
No waiting patients
</p>
)}

{tickets.map((t)=>(

<motion.div
key={t._id}
initial={{opacity:0, y:10}}
animate={{opacity:1, y:0}}
className="bg-white p-4 rounded-xl shadow"
>

<p className="font-semibold">{t.name}</p>

<p className="text-sm text-gray-500">
Age: {t.age} • Queue: {t.queueNumber}
</p>

<p className="text-blue-600 font-bold">
#{t.ticketNumber}
</p>

<div className="flex gap-2 mt-3">

{t.status === "waiting" && (
<>
<button
onClick={()=>handleAccept(t._id)}
className="flex-1 bg-green-600 text-white py-2 rounded-lg"
>
Accept
</button>

<button
onClick={()=>handleReject(t._id)}
className="flex-1 bg-red-600 text-white py-2 rounded-lg"
>
Reject
</button>
</>
)}

{t.status === "accepted" && (
<button
onClick={()=>handleDone(t._id)}
className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
>
Done
</button>
)}

</div>

</motion.div>

))}

</div>

</div>

)
}