import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import PublicDashboard from "./pages/PublicDashboard"

import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"

function App(){

return(

<AuthProvider>

<BrowserRouter>

<Routes>

{/* ======================
   🌍 PUBLIC DASHBOARD
====================== */}
<Route path="/" element={<PublicDashboard />} />

{/* ======================
   🔐 LOGIN
====================== */}
<Route path="/login" element={<Login />} />

{/* ======================
   👨‍⚕️ DOCTOR SYSTEM
====================== */}
<Route
path="/dashboard"
element={
<ProtectedRoute>
<Dashboard/>
</ProtectedRoute>
}
/>

{/* ======================
   🚫 BLOCK UNKNOWN
====================== */}
<Route path="*" element={<Navigate to="/" replace />} />

</Routes>

</BrowserRouter>

</AuthProvider>

)

}

export default App