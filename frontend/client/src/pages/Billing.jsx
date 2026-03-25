import { useEffect, useState } from "react"
import API from "../api/api"
import { motion } from "framer-motion"

export default function Billing(){

const [phone,setPhone] = useState("")
const [patient,setPatient] = useState(null)

const [tests,setTests] = useState([])
const [selectedTests,setSelectedTests] = useState([])

const [payments,setPayments] = useState([])
const [paymentMethod,setPaymentMethod] = useState("")

const [loading,setLoading] = useState(false)

/* LOAD */
useEffect(()=>{
  loadTests()
  loadPayments()
},[])

const loadTests = async()=>{
  const res = await API.get("/billing/tests")
  setTests(res.data)
}

const loadPayments = async()=>{
  const res = await API.get("/billing/payments")
  setPayments(res.data)
}

/* SEARCH */
const searchPatient = async()=>{
  if(!phone) return alert("Enter phone")

  setLoading(true)
  try{
    const res = await API.get(`/billing/search?phone=${phone}`)
    setPatient(res.data)
  }catch{
    alert("Patient not found")
  }finally{
    setLoading(false)
  }
}

/* ADD TEST */
const addTest = (test)=>{
  if(selectedTests.find(t => t._id === test._id)){
    return
  }
  setSelectedTests([...selectedTests,test])
}

/* REMOVE */
const removeTest = (id)=>{
  setSelectedTests(selectedTests.filter(t => t._id !== id))
}

/* TOTAL */
const total = selectedTests.reduce((sum,t)=>sum + t.price,0)
let discount = total > 100 ? total * 0.1 : 0
const finalAmount = total - discount

/* CREATE */
const createInvoice = async()=>{

  if(!patient) return alert("Search patient")
  if(selectedTests.length === 0) return alert("Select tests")
  if(!paymentMethod) return alert("Select payment method")

  try{

    await API.post("/billing/invoice",{
      patientId:patient._id,
      items:selectedTests,
      paymentMethod
    })

    alert("✅ Payment done & sent to Lab")

    setSelectedTests([])
    setPatient(null)
    setPhone("")
    setPaymentMethod("")
    loadPayments()

  }catch{
    alert("Failed")
  }

}

return(

<div className="min-h-screen bg-gray-100 p-4 md:p-10">

<motion.h2
initial={{opacity:0,y:-20}}
animate={{opacity:1,y:0}}
className="text-2xl md:text-3xl font-bold mb-6"
>
💳 Billing System
</motion.h2>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

{/* LEFT SIDE */}
<div className="lg:col-span-2 space-y-6">

{/* SEARCH */}
<div className="bg-white p-5 rounded-2xl shadow">

<h3 className="font-semibold mb-3">Search Patient</h3>

<div className="flex flex-col sm:flex-row gap-3">

<input
placeholder="Enter phone number"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
/>

<button
onClick={searchPatient}
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
>
{loading ? "Searching..." : "Search"}
</button>

</div>

{patient && (
<div className="mt-4 p-4 bg-green-100 rounded-lg">
<p className="font-semibold">{patient.fullName}</p>
<p className="text-sm text-gray-600">{patient.phone}</p>
</div>
)}

</div>

{/* TESTS */}
<div className="bg-white p-5 rounded-2xl shadow">

<h3 className="font-semibold mb-4">Select Tests</h3>

<div className="grid grid-cols-2 md:grid-cols-3 gap-3">

{tests.map(t=>(

<motion.button
whileHover={{scale:1.05}}
key={t._id}
onClick={()=>addTest(t)}
className="border rounded-xl p-3 hover:bg-blue-50 text-sm"
>

<p className="font-medium">{t.name}</p>
<p className="text-blue-600">${t.price}</p>

</motion.button>

))}

</div>

</div>

{/* SELECTED */}
<div className="bg-white p-5 rounded-2xl shadow">

<h3 className="font-semibold mb-4">Selected Tests</h3>

{selectedTests.length === 0 && (
<p className="text-gray-500">No tests selected</p>
)}

{selectedTests.map(t=>(

<div key={t._id} className="flex justify-between items-center border-b py-2">

<span>{t.name}</span>

<button
onClick={()=>removeTest(t._id)}
className="text-red-500"
>
✕
</button>

</div>

))}

</div>

</div>

{/* RIGHT SIDE */}
<div className="space-y-6">

{/* SUMMARY */}
<div className="bg-white p-5 rounded-2xl shadow">

<h3 className="font-semibold mb-4">Invoice Summary</h3>

<div className="space-y-2 text-sm">

<p>Total: <span className="font-semibold">${total}</span></p>
<p>Discount: <span className="text-green-600">${discount}</span></p>
<p className="text-lg font-bold">Final: ${finalAmount}</p>

</div>

</div>

{/* PAYMENT */}
<div className="bg-white p-5 rounded-2xl shadow">

<h3 className="font-semibold mb-4">Payment Method</h3>

<select
value={paymentMethod}
onChange={(e)=>setPaymentMethod(e.target.value)}
className="w-full border p-3 rounded-lg"
>

<option value="">Select Payment</option>
<option value="cash">Cash</option>
<option value="zaad">Zaad</option>
<option value="edahab">E-Dahab</option>

</select>

<button
onClick={createInvoice}
className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
>
Pay & Send to Lab
</button>

</div>

</div>

</div>

</div>

)
}