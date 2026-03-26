import { useState, useContext } from "react"
import API from "../api/api"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { AuthContext } from "../context/AuthContext"

export default function Login(){

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [message,setMessage] = useState("")
  const [loading,setLoading] = useState(false)

  const { login } = useContext(AuthContext)

  const navigate = useNavigate()

  const handleLogin = async (e)=>{
    e.preventDefault()

    setLoading(true)
    setMessage("")

    try{

const res = await API.post("/auth/login", {
  email,
  password
})

login(res.data)
console.log({ email, password })
// 🔥 ALL USERS → DASHBOARD
navigate("/dashboard")

    }catch(error){
      setMessage(
        error.response?.data?.message || "Login failed ❌"
      )
    }finally{
      setLoading(false)
    }
  }

  return(

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600">

      <motion.div
        initial={{opacity:0, y:40}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.6}}
        className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-[380px]"
      >

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          🦷 Dental System Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <motion.button
            whileHover={{scale:1.05}}
            whileTap={{scale:0.95}}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

        </form>

        {message && (
          <p className="text-center text-red-500 mt-4 font-medium">
            {message}
          </p>
        )}

      </motion.div>

    </div>

  )

}