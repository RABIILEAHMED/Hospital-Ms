import { useState, useContext } from "react"
import { motion } from "framer-motion"
import { AuthContext } from "../context/AuthContext"
import { useSearchParams } from "react-router-dom"

// IMPORT PAGES
import { useEffect } from "react"
import API from "../api/api"
import Patients from "./Patients"
import Doctors from "./Doctors"
import Tickets from "./Tickets"
import Billing from "./Billing"
import LabDashboard from "./LabDashboard"
import DoctorQueue from "./DoctorQueue"
import Appointments from "./Appointments"
import PatientProfile from "./PatientProfile"

// CHARTS
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"

export default function Dashboard(){

const { user, logout } = useContext(AuthContext)

const [sidebarOpen,setSidebarOpen] = useState(false)
const [dark,setDark] = useState(false)

const [searchParams] = useSearchParams()
const [activePage,setActivePage] = useState("dashboard")

// MODAL STATE
const [selectedPatientId,setSelectedPatientId] = useState(null)
const [showProfile,setShowProfile] = useState(false)
const [error,setError] = useState("")

const [stats,setStats] = useState({
  patients: 0,
  appointments: 0,
  doctors: 0
})

const [loading,setLoading] = useState(true)

useEffect(() => {
  const loadStats = async () => {
    try {
      const res = await API.get("/dashboard/stats") // ✅ backend route
      setStats(res.data)
    } catch (err) {
      console.log(err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  loadStats()
}, [])

/* ====================== DATA ====================== */

const revenueData = [
{month:"Jan",revenue:2000},
{month:"Feb",revenue:3200},
{month:"Mar",revenue:2800},
{month:"Apr",revenue:4500},
{month:"May",revenue:3800},
{month:"Jun",revenue:5200}
]

const patientData = [
{month:"Jan",patients:20},
{month:"Feb",patients:30},
{month:"Mar",patients:25},
{month:"Apr",patients:40},
{month:"May",patients:35},
{month:"Jun",patients:50}
]

/* ====================== MENU ====================== */

const menuItems = [
{ name:"Dashboard", key:"dashboard", roles:["admin","dentist","receptionist","accountant","labTechnician"] },
{ name:"Patients", key:"patients", roles:["admin","dentist","receptionist"] },
{ name:"Appointments", key:"appointments", roles:["admin","receptionist"] },
{ name:"Doctors", key:"doctors", roles:["admin","receptionist"] },
{ name:"Tickets", key:"tickets", roles:["admin","receptionist"] },
{ name:"Doctor Queue", key:"doctorQueue", roles:["admin","dentist"] },
{ name:"Billing", key:"billing", roles:["admin","accountant"] },
{ name:"Lab", key:"lab", roles:["admin","labTechnician"] }
]

const filteredMenu = menuItems.filter(item =>
  item.roles.includes(user?.role)
)

/* ====================== PROFILE ====================== */

const openPatientProfile = (id) => {
  if(!id){
    setError("Invalid patient ID")
    return
  }
  setSelectedPatientId(id)
  setShowProfile(true)
}

/* ====================== RENDER ====================== */

const renderContent = () => {

switch(activePage){

case "patients":
  return <Patients onView={openPatientProfile} />

case "appointments":
  return <Appointments/>

case "doctors":
  return <Doctors/>

case "tickets":
  return <Tickets/>

case "doctorQueue":
  return <DoctorQueue/>

case "billing":
  return <Billing/>

case "lab":
  return <LabDashboard/>

default:
return (
<>
<motion.h1
initial={{opacity:0,y:-20}}
animate={{opacity:1,y:0}}
className="text-2xl md:text-3xl font-bold mb-2"
>
Welcome, {user?.name} 👋
</motion.h1>

<p className="text-gray-500 mb-8 capitalize">
Role: {user?.role}
</p>

{/* STATS */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

<div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
<h3>Patients</h3>
<p className="text-3xl text-blue-600">
  {loading ? "..." : stats.patients}
</p>
</div>

<div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
<h3>Appointments</h3>
<p className="text-3xl text-green-600">
  {loading ? "..." : stats.appointments}
</p>
</div>

<div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
<h3>Doctors</h3>
<p className="text-3xl text-purple-600">
  {loading ? "..." : stats.doctors}
</p>
</div>

</div>

{/* CHARTS */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">

<div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
<h3 className="mb-4">Revenue</h3>
<ResponsiveContainer width="100%" height={250}>
<LineChart data={revenueData}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="month"/>
<YAxis/>
<Tooltip/>
<Line type="monotone" dataKey="revenue" stroke="#2563eb"/>
</LineChart>
</ResponsiveContainer>
</div>

<div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
<h3 className="mb-4">Patients Growth</h3>
<ResponsiveContainer width="100%" height={250}>
<LineChart data={patientData}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="month"/>
<YAxis/>
<Tooltip/>
<Line type="monotone" dataKey="patients" stroke="#16a34a"/>
</LineChart>
</ResponsiveContainer>
</div>

</div>

</>
)
}
}

/* ====================== UI ====================== */

return(

<div className={`${dark ? "dark" : ""} flex min-h-screen bg-gray-100`}>

{/* SIDEBAR */}
<div className={`fixed inset-y-0 left-0 z-40 w-64 bg-blue-800 text-white p-6 flex flex-col transition-transform duration-300
${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>

<h2 className="text-2xl font-bold mb-6">🦷 Hospital System</h2>

<div className="mb-6 bg-blue-700 p-3 rounded">
<p>{user?.name}</p>
<p className="text-sm">{user?.role}</p>
</div>

<nav className="space-y-2 overflow-y-auto">
{filteredMenu.map(item => (
<button
key={item.key}
onClick={()=>{
setActivePage(item.key)
setSidebarOpen(false)
}}
className={`w-full text-left p-2 rounded transition ${
activePage === item.key
? "bg-white text-blue-700 font-bold"
: "hover:bg-blue-600"
}`}
>
{item.name}
</button>
))}
</nav>

<button onClick={logout} className="mt-auto bg-red-500 p-2 rounded hover:bg-red-600">
Logout
</button>

</div>

{/* OVERLAY */}
{sidebarOpen && (
<div
className="fixed inset-0 bg-black/50 z-30 md:hidden"
onClick={()=>setSidebarOpen(false)}
/>
)}

{/* MAIN */}
<div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">

{/* TOPBAR */}
<div className="bg-white p-4 shadow flex justify-between items-center sticky top-0 z-20">

<button
className="md:hidden text-2xl"
onClick={()=>setSidebarOpen(!sidebarOpen)}
>
☰
</button>

<h1 className="font-semibold capitalize">{activePage}</h1>

<button
onClick={()=>setDark(!dark)}
className="bg-gray-800 text-white px-3 py-1 rounded"
>
{dark ? "☀" : "🌙"}
</button>

</div>

<div className="p-4 md:p-10">
{renderContent()}
</div>

</div>

{/* MODALS */}
{showProfile && (
<PatientProfile
id={selectedPatientId}
onClose={()=>setShowProfile(false)}
/>
)}

{/* ERROR */}
{error && (
<div className="fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow">
{error}
<button onClick={()=>setError("")} className="ml-2">✖</button>
</div>
)}

</div>
)
}