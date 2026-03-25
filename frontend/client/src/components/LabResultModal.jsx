import {useState} from "react"

export default function LabResultModal({data,onClose,onSubmit}){

const [results,setResults] = useState(
data.tests.map(t=>({
testName:t.testName,
result:""
}))
)

const handleChange=(index,value)=>{

const newResults=[...results]

newResults[index].result=value

setResults(newResults)

}

return(

<div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

<div className="bg-white p-6 rounded-xl w-[500px]">

<h2 className="text-xl font-bold mb-4">
Lab Result Entry
</h2>

<p className="mb-2">
<b>Patient:</b> {data.patient.fullName}
</p>

<p className="mb-4">
<b>Phone:</b> {data.patient.phone}
</p>

{results.map((r,i)=>(

<div key={i} className="mb-3">

<p className="font-semibold">{r.testName}</p>

<textarea

className="border w-full p-2"

placeholder="Enter Result"

onChange={(e)=>handleChange(i,e.target.value)}

/>

</div>

))}

<div className="flex justify-end gap-3 mt-4">

<button
onClick={onClose}
className="bg-gray-400 text-white px-4 py-2"
>
Cancel
</button>

<button
onClick={()=>onSubmit(results)}
className="bg-green-600 text-white px-4 py-2"
>
Save Result
</button>

</div>

</div>

</div>

)

}