import { useState } from "react"
import {
ResponsiveContainer,
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid
} from "recharts"

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

export default function AdvancedDashboard(){

const [dark,setDark] = useState(false)

return(

<div className={dark ? "dark" : ""}>

<div className="mt-10 space-y-10">

{/* Dark Mode */}

<div className="flex justify-end">

<button
onClick={()=>setDark(!dark)}
className="bg-gray-800 text-white px-4 py-2 rounded"
>
Toggle Dark Mode
</button>

</div>

{/* Charts */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

<h3 className="font-semibold mb-4">
Clinic Revenue
</h3>

<ResponsiveContainer width="100%" height={250}>

<LineChart data={revenueData}>

<CartesianGrid strokeDasharray="3 3" />

<XAxis dataKey="month" />

<YAxis />

<Tooltip />

<Line
type="monotone"
dataKey="revenue"
stroke="#2563eb"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

<h3 className="font-semibold mb-4">
Patients Growth
</h3>

<ResponsiveContainer width="100%" height={250}>

<LineChart data={patientData}>

<CartesianGrid strokeDasharray="3 3" />

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="patients"
stroke="#16a34a"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

{/* Notifications */}

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

<h3 className="font-semibold mb-4">
Notifications
</h3>

<ul className="space-y-2 text-gray-600 dark:text-gray-300">

<li>🔔 New patient registered</li>
<li>🔔 Appointment booked</li>
<li>🔔 Invoice payment received</li>

</ul>

</div>

{/* Doctor Schedule */}

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

<h3 className="font-semibold mb-4">
Doctor Schedule
</h3>

<table className="w-full text-left">

<thead>

<tr className="border-b">

<th className="py-2">Doctor</th>
<th>Specialization</th>
<th>Time</th>

</tr>

</thead>

<tbody>

<tr className="border-b">

<td className="py-2">Dr Ahmed</td>
<td>Orthodontist</td>
<td>9:00 - 3:00</td>

</tr>

<tr className="border-b">

<td className="py-2">Dr Fatima</td>
<td>Dental Surgeon</td>
<td>10:00 - 4:00</td>

</tr>

<tr>

<td className="py-2">Dr Ali</td>
<td>Implant Specialist</td>
<td>11:00 - 5:00</td>

</tr>

</tbody>

</table>

</div>

{/* Calendar Preview */}

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

<h3 className="font-semibold mb-4">
Appointment Calendar
</h3>

<p className="text-gray-600 dark:text-gray-300">

Calendar module ready for appointment scheduling.

</p>

</div>

</div>

</div>

)

}