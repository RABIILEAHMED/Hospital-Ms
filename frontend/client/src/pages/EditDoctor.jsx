import {useEffect,useState} from "react"
import {useParams,useNavigate} from "react-router-dom"
import API from "../api/api"

export default function EditDoctor(){

const {id} = useParams()
const navigate = useNavigate()

const [form,setForm] = useState({
name:"",
email:"",
phone:"",
specialization:"",
experience:"",
startTime:"",
endTime:""
})

useEffect(()=>{

API.get(`/doctors/${id}`)
.then(res=>setForm(res.data))

},[id])

const handleChange=(e)=>{

setForm({
...form,
[e.target.name]:e.target.value
})

}

const submit = async(e)=>{

e.preventDefault()

await API.put(`/doctors/${id}`,form)

alert("Doctor updated")

navigate("/doctors")

}

return(

<div className="p-10">

<h2 className="text-2xl font-bold mb-6">
Edit Doctor
</h2>

<form onSubmit={submit} className="space-y-4">

<input name="name" value={form.name} onChange={handleChange} />

<input name="email" value={form.email} onChange={handleChange} />

<input name="phone" value={form.phone} onChange={handleChange} />

<input name="specialization" value={form.specialization} onChange={handleChange} />

<input name="experience" value={form.experience} onChange={handleChange} />

<input name="startTime" value={form.startTime} onChange={handleChange} />

<input name="endTime" value={form.endTime} onChange={handleChange} />

<button className="bg-blue-600 text-white px-5 py-2 rounded">
Update Doctor
</button>

</form>

</div>

)

}