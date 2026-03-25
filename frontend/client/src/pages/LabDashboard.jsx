import { useEffect, useState } from "react"
import API from "../api/api"
import { motion, AnimatePresence } from "framer-motion"

export default function LabDashboard() {

/* ================= STATE ================= */
const [queue,setQueue] = useState([])
const [selected,setSelected] = useState(null)
const [results,setResults] = useState([])
const [notes,setNotes] = useState("")
const [authorizedBy,setAuthorizedBy] = useState("")
const [loading,setLoading] = useState(false)
const [message,setMessage] = useState("")

/* ================= LOAD ================= */
useEffect(()=>{ loadQueue() },[])

const loadQueue = async()=>{
  try{
    setLoading(true)
    const res = await API.get("/lab/queue")
    setQueue(res.data)
  }catch(err){
    console.error(err)
  }finally{
    setLoading(false)
  }
}

/* ================= STATS ================= */
const stats = {
  total: queue.length,
  waiting: queue.filter(q=>q.status==="waiting").length,
  processing: queue.filter(q=>q.status==="processing").length,
  done: queue.filter(q=>q.status==="completed").length
}

/* ================= ACTIONS ================= */
const startProcessing = async(id)=>{
  await API.put(`/lab/start/${id}`)
  loadQueue()
}

const openForm=(lab)=>{
  setSelected(lab)
  setNotes(lab.notes || "")
  setAuthorizedBy(lab.authorizedBy || "")

  const safeTests = Array.isArray(lab.tests) ? lab.tests : []

  setResults(
    safeTests.map(t=>({
      item: t.item || "",
      reference: t.reference || "",
      unit: t.unit || "",
      result: t.result || ""
    }))
  )
}

const handleChange=(index,value)=>{
  const updated=[...results]
  updated[index].result=value
  setResults(updated)
}

const submitResult=async()=>{
  try{
    await API.post(`/lab/result/${selected._id}`,{
      results,
      notes,
      authorizedBy
    })
    setMessage("✅ Result saved successfully")
    closeModal()
    loadQueue()
  }catch{
    setMessage("❌ Failed to save")
  }
}

const downloadPDF = async(id,name)=>{
  const res = await API.get(`/lab/download/${id}`,{
    responseType:"blob"
  })

  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download",`Lab_${name}.pdf`)
  document.body.appendChild(link)
  link.click()
}

/* ================= HELPERS ================= */
const statusBadge = (status)=>{
  if(status==="waiting") return "bg-yellow-100 text-yellow-700"
  if(status==="processing") return "bg-blue-100 text-blue-700"
  if(status==="completed") return "bg-green-100 text-green-700"
}

/* ================= CLOSE ================= */
const closeModal=()=>{
  setSelected(null)
  setResults([])
}

/* ================= UI ================= */
return(
<div className="min-h-screen bg-gray-100 p-4 md:p-10">

<motion.h1
initial={{opacity:0,y:-20}}
animate={{opacity:1,y:0}}
className="text-2xl md:text-3xl font-bold mb-6"
>
🧪 Lab Dashboard
</motion.h1>

{/* MESSAGE */}
<AnimatePresence>
{message && (
<motion.div
initial={{opacity:0,y:-10}}
animate={{opacity:1,y:0}}
exit={{opacity:0}}
className="mb-4 p-3 rounded-xl bg-white shadow"
>
{message}
</motion.div>
)}
</AnimatePresence>

{/* STATS */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

{[
{label:"Total",value:stats.total},
{label:"Waiting",value:stats.waiting,color:"text-yellow-600"},
{label:"Processing",value:stats.processing,color:"text-blue-600"},
{label:"Completed",value:stats.done,color:"text-green-600"}
].map((s,i)=>(
<motion.div
key={i}
whileHover={{scale:1.05}}
className="bg-white p-4 rounded-2xl shadow"
>
<p className="text-sm text-gray-500">{s.label}</p>
<p className={`text-2xl font-bold ${s.color || ""}`}>
{s.value}
</p>
</motion.div>
))}

</div>

{/* TABLE */}
<div className="bg-white rounded-2xl shadow overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-gray-50 text-gray-500">
<tr>
<th className="p-3 text-left">Patient</th>
<th>Doctor</th>
<th>Tests</th>
<th>Total</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{loading ? (
<tr>
<td colSpan="6" className="text-center p-6">Loading...</td>
</tr>
) : queue.length === 0 ? (
<tr>
<td colSpan="6" className="text-center p-6">No Data</td>
</tr>
) : (

queue.map(q=>(

<tr key={q._id} className="border-t hover:bg-gray-50">

<td className="p-3 font-semibold">
{q.patient?.fullName}
</td>

<td>{q.doctor?.name || "—"}</td>

<td className="text-xs">
{q.tests?.map((t,i)=>(<div key={i}>• {t.item}</div>))}
</td>

<td>${q.total || 0}</td>

<td>
<span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(q.status)}`}>
{q.status}
</span>
</td>

<td className="flex gap-2 p-3 flex-wrap">

{q.status==="waiting" && (
<button
onClick={()=>startProcessing(q._id)}
className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
>
Start
</button>
)}

{q.status!=="completed" && (
<button
onClick={()=>openForm(q)}
className="bg-blue-600 text-white px-3 py-1 rounded-lg"
>
Process
</button>
)}

{q.status==="completed" && (
<button
onClick={()=>downloadPDF(q._id,q.patient.fullName)}
className="bg-purple-600 text-white px-3 py-1 rounded-lg"
>
PDF
</button>
)}

</td>

</tr>

))
)}

</tbody>

</table>

</div>

{/* MODAL */}
<AnimatePresence>
{selected && (
<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
exit={{opacity:0}}
className="fixed inset-0 bg-black/40 flex justify-center items-center p-4"
>

<motion.div
initial={{scale:0.9}}
animate={{scale:1}}
exit={{scale:0.9}}
className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
>

<h2 className="text-xl font-bold mb-4">
🧾 Lab Result Entry
</h2>

<p className="mb-4 text-sm text-gray-600">
Patient: <strong>{selected.patient.fullName}</strong>
</p>

<div className="space-y-3">

{results.map((t,i)=>(

<div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2">

<div className="font-medium">{t.item}</div>

<input
className="border p-2 rounded-lg"
value={t.result}
onChange={(e)=>handleChange(i,e.target.value)}
placeholder="Result"
/>

<div className="text-gray-400 text-xs">{t.reference}</div>
<div className="text-gray-400 text-xs">{t.unit}</div>

</div>

))}

</div>

<textarea
className="border w-full p-3 rounded-lg mt-4"
placeholder="Notes..."
value={notes}
onChange={(e)=>setNotes(e.target.value)}
/>

<input
className="border w-full p-3 rounded-lg mt-3"
placeholder="Authorized By"
value={authorizedBy}
onChange={(e)=>setAuthorizedBy(e.target.value)}
/>

<div className="flex justify-end gap-3 mt-5">

<button
onClick={closeModal}
className="bg-gray-400 text-white px-4 py-2 rounded-lg"
>
Cancel
</button>

<button
onClick={submitResult}
className="bg-green-600 text-white px-4 py-2 rounded-lg"
>
Save Result
</button>

</div>

</motion.div>

</motion.div>
)}
</AnimatePresence>

</div>
)
}