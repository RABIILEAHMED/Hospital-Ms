import {useParams,useNavigate} from "react-router-dom"
import {useEffect,useState} from "react"
import API from "../api/api"
import { motion } from "framer-motion"

export default function DoctorProfile(){

const {id} = useParams()
const navigate = useNavigate()

const [doctor,setDoctor] = useState(null)
const [loading,setLoading] = useState(true)

useEffect(()=>{

API.get(`/doctors/${id}`)
.then(res=>{
setDoctor(res.data)
setLoading(false)
})
.catch(()=>{
setLoading(false)
})

},[id])

if(loading){

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<p className="text-lg font-semibold">
Loading doctor profile...
</p>

</div>

)

}

if(!doctor){
return(
<div className="min-h-screen flex items-center justify-center">
<p>Doctor not found</p>
</div>
)
}

return(

<div className="min-h-screen bg-gray-100 p-10">

<motion.div
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
transition={{duration:0.4}}
className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8"
>

{/* Header */}

<div className="flex items-center justify-between mb-6">

<h2 className="text-2xl font-bold">
👨‍⚕️ Doctor Profile
</h2>

<button
onClick={()=>navigate("/doctors")}
className="text-blue-600 hover:underline"
>
Back
</button>

</div>

{/* Avatar */}

<div className="flex justify-center mb-6">

<div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">

{doctor.name?.charAt(0)}

</div>

</div>

{/* Doctor Info */}

<div className="space-y-4">

<div className="bg-gray-50 p-4 rounded-lg">
<p className="text-sm text-gray-500">Name</p>
<p className="font-semibold">{doctor.name}</p>
</div>

<div className="bg-gray-50 p-4 rounded-lg">
<p className="text-sm text-gray-500">Email</p>
<p className="font-semibold">{doctor.email}</p>
</div>

<div className="bg-gray-50 p-4 rounded-lg">
<p className="text-sm text-gray-500">Phone</p>
<p className="font-semibold">{doctor.phone}</p>
</div>

<div className="bg-gray-50 p-4 rounded-lg">
<p className="text-sm text-gray-500">Specialization</p>
<p className="font-semibold">{doctor.specialization}</p>
</div>

<div className="bg-gray-50 p-4 rounded-lg">
<p className="text-sm text-gray-500">Experience</p>
<p className="font-semibold">
{doctor.experience} years
</p>
</div>

<div className="bg-gray-50 p-4 rounded-lg">
<p className="text-sm text-gray-500">Working Hours</p>
<p className="font-semibold">
{doctor.startTime} - {doctor.endTime}
</p>
</div>

</div>

</motion.div>

</div>

)

}