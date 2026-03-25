import { useEffect, useState } from "react"
import API from "../api/api"

export default function Doctors(){

const [doctors,setDoctors] = useState([])
const [editingId,setEditingId] = useState(null)

const initialForm = {
fullName:"",
gender:"",
specialty:"",
phone:"",
email:"",
experience:"",
qualification:"",
address:"",
availability:"Available"
}

const [form,setForm] = useState(initialForm)

useEffect(()=>{
fetchDoctors()
},[])

const fetchDoctors = async()=>{
try{
const res = await API.get("/doctors")
setDoctors(res.data || [])
}catch(err){
console.log(err)
}
}

/* INPUT */
const handleChange = (e)=>{
setForm(prev=>({
...prev,
[e.target.name]: e.target.value || ""
}))
}

/* SUBMIT */
const handleSubmit = async(e)=>{
e.preventDefault()

try{

if(editingId){
await API.put(`/doctors/${editingId}`, form)
}else{
await API.post("/doctors", form)
}

resetForm()
fetchDoctors()

}catch(err){
console.log("ERROR:", err.response?.data || err.message)
alert(err.response?.data?.message || "Error occurred")
}

}

/* EDIT */
const handleEdit = (doc)=>{
setEditingId(doc._id)

/* ✅ PREVENT UNDEFINED */
setForm({
fullName: doc.fullName || "",
gender: doc.gender || "",
specialty: doc.specialty || "",
phone: doc.phone || "",
email: doc.email || "",
experience: doc.experience || "",
qualification: doc.qualification || "",
address: doc.address || "",
availability: doc.availability || "Available"
})
}

/* DELETE */
const handleDelete = async(id)=>{
if(!window.confirm("Delete doctor?")) return

try{
await API.delete(`/doctors/${id}`)
fetchDoctors()
}catch(err){
console.log(err)
}
}

/* RESET */
const resetForm = ()=>{
setForm(initialForm)
setEditingId(null)
}

return(

<div className="p-10">

<h2 className="text-2xl font-bold mb-6">
👨‍⚕️ Doctors Management
</h2>

<form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-8">

<input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded" required />

<select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded" required>
<option value="">Select Gender</option>
<option value="male">Male</option>
<option value="female">Female</option>
</select>

<input name="specialty" value={form.specialty} onChange={handleChange} placeholder="Specialty" className="border p-2 rounded" required />

<input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" required />

<input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" required />

<input name="experience" value={form.experience} onChange={handleChange} placeholder="Experience" className="border p-2 rounded" />

<input name="qualification" value={form.qualification} onChange={handleChange} placeholder="Qualification" className="border p-2 rounded" />

<input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="border p-2 rounded" />

<select name="availability" value={form.availability} onChange={handleChange} className="border p-2 rounded">
<option value="Available">Available</option>
<option value="Busy">Busy</option>
<option value="Off">Off</option>
</select>

<button className="col-span-3 bg-blue-600 text-white py-2 rounded">
{editingId ? "Update Doctor" : "Add Doctor"}
</button>

</form>

{/* LIST */}

<div className="space-y-4">

{doctors.map((d)=>(

<div key={d._id} className="bg-white p-4 rounded shadow flex justify-between">

<div>
<p className="font-bold">{d.fullName}</p>
<p className="text-sm text-gray-500">{d.specialty}</p>
<p className="text-xs">{d.email}</p>
</div>

<div className="flex gap-2">

<button onClick={()=>handleEdit(d)} className="px-3 py-1 bg-yellow-400 rounded">
Edit
</button>

<button onClick={()=>handleDelete(d._id)} className="px-3 py-1 bg-red-500 text-white rounded">
Delete
</button>

</div>

</div>

))}

</div>

</div>

)
}