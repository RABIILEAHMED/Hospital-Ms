import { useEffect, useState } from "react"
import API from "../api/api"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"



export default function Patients({ onView }) {
    

  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1)
  const patientsPerPage = 10

  /* ================= FETCH ================= */
  const fetchPatients = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await API.get("/patients")

      // ✅ SAFE ARRAY
      setPatients(Array.isArray(res.data) ? res.data : [])

    } catch (err) {
      console.log(err)
      setError("Failed to load patients")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  /* ================= DEBOUNCE ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  /* ================= FILTER ================= */
  const filteredPatients = patients.filter((p) =>
    (p?.fullName || "")
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
  )

  /* ================= PAGINATION ================= */
  const indexOfLast = currentPage * patientsPerPage
  const indexOfFirst = indexOfLast - patientsPerPage
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage)

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="p-10 flex justify-center items-center h-screen">
        <p className="text-gray-500 animate-pulse">
          ⏳ Loading patients...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>

        <button
          onClick={fetchPatients}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          🔄 Retry
        </button>
      </div>
    )
  }

  /* ================= UI ================= */
  return (

    <div className="min-h-screen bg-gray-100 p-4 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <h2 className="text-2xl md:text-3xl font-bold">
          👥 Patients
        </h2>

        <Link
          to="/add-patient"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
        >
          + Add Patient
        </Link>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">

        <StatCard label="Total" value={patients.length} />
        <StatCard label="Results" value={filteredPatients.length} />
        <StatCard label="Page" value={currentPage} />

      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search patient..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setCurrentPage(1)
        }}
        className="w-full md:w-1/3 p-3 border rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* EMPTY */}
      {currentPatients.length === 0 ? (

        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
          No patients found
        </div>

      ) : (

        <>
          {/* DESKTOP */}
          <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th className="text-center">Profile</th>
                </tr>
              </thead>

              <tbody>

                {currentPatients.map((p, index) => (

                  <motion.tr
                    key={p._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-3 flex items-center gap-3">

                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm font-bold">
                        {p?.fullName ? p.fullName.charAt(0).toUpperCase() : "?"}
                      </div>

                      {p?.fullName || "-"}

                    </td>

                    <td>{p?.phone || "-"}</td>

                    <td className="capitalize">
                      {p?.gender || "-"}
                    </td>

                    <td className="text-center">

                      {/* ✅ VIEW PROFILE (FIXED + SAFE) */}
  <button
  onClick={() => {
    console.log("PATIENT:", p)
    onView?.(p._id || p.id)
  }}
  className="text-blue-600 hover:underline font-medium"
>
  View
</button>

                    </td>

                  </motion.tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* MOBILE */}
          <div className="md:hidden space-y-3">

            {currentPatients.map((p, index) => (

              <motion.div
                key={p._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-xl shadow"
              >

                <div className="flex items-center gap-3 mb-2">

                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold">
                    {p?.fullName ? p.fullName.charAt(0).toUpperCase() : "?"}
                  </div>

                  <div>
                    <p className="font-semibold">{p?.fullName}</p>
                    <p className="text-sm text-gray-500">{p?.phone}</p>
                  </div>

                </div>

                <p className="text-sm text-gray-500 capitalize mb-2">
                  Gender: {p?.gender || "-"}
                </p>

               <button
  onClick={() => onView?.(p._id)}
  className="text-blue-600 text-sm font-medium"
>
  View Profile →
</button>

              </motion.div>

            ))}

          </div>

        </>

      )}

      {/* PAGINATION */}
      {filteredPatients.length > patientsPerPage && (

        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-6">

          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          <p className="text-sm">
            Page {currentPage} of {totalPages}
          </p>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>

        </div>

      )}

    </div>
  )
}

/* ================= REUSABLE ================= */
function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}