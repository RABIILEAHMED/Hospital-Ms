import { useEffect, useState } from "react"
import API from "../api/api"
import socket from "../socket"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import QueueEnhancements from "./QueueEnhancements"
import PublicTicketForm from "./PublicTicketForm"

export default function PublicDashboard(){

  const [waiting,setWaiting] = useState([])
  const [current,setCurrent] = useState(null)
  const [loading,setLoading] = useState(true)
  const [showTicketForm, setShowTicketForm] = useState(false) // show/hide form
  const [ticketSuccess, setTicketSuccess] = useState(null)    // success info

  /* ================= LOAD ================= */
  const loadData = async()=>{
    try{
      setLoading(true)
      const res = await API.get("/tickets/public")
      const all = res.data || []

      setWaiting(all.filter(t => t.status === "waiting"))
      setCurrent(all.find(t => t.status === "accepted") || null)
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

  /* ================= REALTIME ================= */
  useEffect(()=>{
    loadData()
    socket.on("ticketCreated",loadData)
    socket.on("ticketUpdated",loadData)
    return ()=>{
      socket.off("ticketCreated")
      socket.off("ticketUpdated")
    }
  },[])

  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      {/* 🔥 NAVBAR */}
      <div className="flex justify-between items-center p-5 bg-white/80 backdrop-blur shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          🏥 <span>Hospital Ms</span>
        </h1>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </Link>
      </div>

      {/* 🔥 HERO */}
      <div className="text-center py-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Live Patient Queue
        </h2>
        <p className="text-gray-500">
          Please wait for your turn — updates are live ⚡
        </p>
      </div>

      {/* 🔥 STATS */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4 mb-8 px-4">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Waiting</p>
          <p className="text-2xl font-bold text-blue-600">{waiting.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Now Serving</p>
          <p className="text-2xl font-bold text-green-600">
            {current ? current.ticketNumber : "--"}
          </p>
        </div>
      </div>

      {/* 🔥 NOW SERVING */}
      <div className="max-w-3xl mx-auto mb-8 px-4">
        <motion.div
          initial={{scale:0.95,opacity:0}}
          animate={{scale:1,opacity:1}}
          className="bg-gradient-to-r from-green-100 to-green-50 p-6 rounded-2xl shadow text-center border border-green-200"
        >
          <h3 className="text-lg font-semibold mb-2">🎯 Now Serving</h3>

          <QueueEnhancements 
            current={current} 
            waiting={waiting} 
          />

          {loading ? (
            <p className="text-gray-400 animate-pulse">Loading...</p>
          ) : current ? (
            <>
              <p className="text-3xl font-bold text-green-700">{current.name}</p>
              <p className="text-sm text-gray-600 mt-1">Ticket #{current.ticketNumber}</p>
            </>
          ) : (
            <p className="text-gray-500">No active patient</p>
          )}

        </motion.div>
      </div>

      {/* 🔥 WAITING LIST */}
      <div className="max-w-3xl mx-auto px-4 pb-10">
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">📋 Waiting Queue</h3>
            <span className="text-sm text-gray-500">{waiting.length} patients</span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {waiting.map((t,index)=>(
              <motion.div
                key={t._id}
                initial={{opacity:0,y:10}}
                animate={{opacity:1,y:0}}
                transition={{delay:index * 0.05}}
                className={`flex justify-between items-center p-3 rounded-lg
                  ${index === 0 ? "bg-blue-100 border border-blue-200" : "bg-gray-50"}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-full text-xs">
                    {index + 1}
                  </span>
                  <p className="font-medium">{t.name}</p>
                </div>
                <span className="text-blue-600 font-bold">#{t.ticketNumber}</span>
              </motion.div>
            ))}

            {!loading && waiting.length === 0 && (
              <p className="text-gray-500 text-center py-6">No patients waiting 🙌</p>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 GET TICKET BUTTON */}
      <div className="max-w-3xl mx-auto px-4 mb-4 flex justify-center">
        <button 
          onClick={() => setShowTicketForm(!showTicketForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition flex items-center gap-2"
        >
          🎫 {showTicketForm ? "Hide Ticket Form" : "Get Ticket"}
        </button>
      </div>

      {/* 🔥 TICKET FORM (ANIMATED) */}
      <AnimatePresence>
        {showTicketForm && (
          <motion.div
            key="ticketForm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto px-4 mb-10"
          >
            <PublicTicketForm 
              onSuccess={(ticket) => {
                setTicketSuccess(ticket); 
                setShowTicketForm(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔥 SUCCESS MODAL */}
      <AnimatePresence>
        {ticketSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center">
              <h3 className="text-lg font-semibold text-green-600 mb-2">🎉 Ticket Created!</h3>
              <p className="text-gray-600 mb-4">{ticketSuccess.name}</p>
              <p className="text-gray-800 font-bold text-xl mb-2">Ticket #{ticketSuccess.ticketNumber}</p>
              <button
                onClick={() => setTicketSuccess(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
            <div 
              className="fixed inset-0 bg-black/30"
              onClick={() => setTicketSuccess(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔥 SIMPLE SMALL FOOTER */}
      <div className="bg-white border-t text-center text-xs text-gray-600 py-3 px-4">
        🏥 <span className="font-semibold">Hospital Ms</span> — Smart hospital queue system with real-time updates. Fast, simple, and efficient patient management ⚡ <br/>
        Realtime Queue ⚡ • Secure API 🔐 • Modern UI 🎨 <br/>
        <a 
          href="https://khalidportifolio.vercel.app/" 
          target="_blank" 
          rel="noreferrer"
          className="text-blue-600 hover:underline"
        >
          Developer
        </a>
      </div>

    </div>
  )
}