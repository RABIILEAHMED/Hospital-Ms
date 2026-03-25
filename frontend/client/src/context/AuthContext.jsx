import { createContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode" // ✅ FIXED

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      try {
        const decoded = jwtDecode(token)

        setUser({
          token,
          id: decoded.id,
          role: decoded.role
        })

      } catch (err) {
        console.error("Invalid token")
        logout()
      }
    }
  }, [])

  /* ======================
     LOGIN
  ====================== */
  const login = (data) => {
    localStorage.setItem("token", data.token)

    setUser({
      token: data.token,
      id: data.user.id,
      role: data.user.role,
      name: data.user.name
    })
  }

  /* ======================
     LOGOUT
  ====================== */
  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}