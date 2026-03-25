import { useEffect, useState } from "react"
import API from "../api/api"

export default function Appointments(){

const [appointments,setAppointments] = useState([])
const [patients,setPatients] = useState([])
const [doctors,setDoctors] = useState([])

const [form,setForm] = useState({
patient:"",
doctor:"",
date:"",
time:"",
reason:""
})

useEffect(()=>{
fetchAll()
},[])

const fetchAll = async()=>{

const [a,p,d] = await Promise.all([
API.get("/appointments"),
API.get("/patients"),
API.get("/doctors")
])

setAppointments(a.data)
setPatients(p.data)
setDoctors(d.data)
}

/* HANDLE */
const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value})
}

/* CREATE */
const handleSubmit = async(e)=>{
e.preventDefault()

await API.post("/appointments",form)

setForm({
patient:"",
doctor:"",
date:"",
time:"",
reason:""
})

fetchAll()
}

/* UPDATE STATUS */
const updateStatus = async(id,status)=>{
await API.put(`/appointments/${id}`,{status})
fetchAll()
}

/* DELETE */
const handleDelete = async(id)=>{
if(!window.confirm("Delete appointment?")) return
await API.delete(`/appointments/${id}`)
fetchAll()
}

return(

<div className="p-10">

<h2 className="text-2xl font-bold mb-6">
📅 Appointments
</h2>

{/* FORM */}

<form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-8">

<select name="patient" value={form.patient} onChange={handleChange} className="border p-2 rounded" required>
<option value="">Select Patient</option>
{patients.map(p=>(
<option key={p._id} value={p._id}>
{p.fullName}
</option>
))}
</select>

<select name="doctor" value={form.doctor} onChange={handleChange} className="border p-2 rounded" required>
<option value="">Select Doctor</option>
{doctors.map(d=>(
<option key={d._id} value={d._id}>
{d.fullName} ({d.specialty})
</option>
))}
</select>

<input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 rounded" required />

<input type="time" name="time" value={form.time} onChange={handleChange} className="border p-2 rounded" required />

<input name="reason" placeholder="Reason" value={form.reason} onChange={handleChange} className="border p-2 rounded" />

<button className="col-span-3 bg-blue-600 text-white py-2 rounded">
Create Appointment
</button>

</form>

{/* LIST */}

<div className="space-y-4">

{appointments.map(a=>(

<div key={a._id} className="bg-white p-4 rounded shadow">

<p className="font-bold">
{a.patient?.fullName} → {a.doctor?.fullName}
</p>

<p className="text-sm text-gray-500">
{a.date} | {a.time}
</p>

<p className="text-sm">
Status: <span className="font-semibold">{a.status}</span>
</p>

<div className="flex gap-2 mt-2">

<button onClick={()=>updateStatus(a._id,"completed")} className="bg-green-500 text-white px-2 py-1 rounded">
Done
</button>

<button onClick={()=>updateStatus(a._id,"cancelled")} className="bg-yellow-500 px-2 py-1 rounded">
Cancel
</button>

<button onClick={()=>handleDelete(a._id)} className="bg-red-500 text-white px-2 py-1 rounded">
Delete
</button>

</div>

</div>

))}

</div>

</div>

)
}