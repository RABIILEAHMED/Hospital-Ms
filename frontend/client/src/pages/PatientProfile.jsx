import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API from "../api/api"
import { motion } from "framer-motion"

export default function PatientProfile({ id: propId, onClose }) {

  const { id: paramId } = useParams()
  const navigate = useNavigate()

  // ✅ USE BOTH (IMPORTANT FIX)
  const id = propId || paramId

  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* ================= FETCH PATIENT ================= */
  const fetchPatient = async () => {
    try {
      if (!id) return

      setLoading(true)
      setError(null)

      const res = await API.get(`/patients/${id}`)

      if (res?.data) {
        setPatient(res.data)
      } else {
        setError("No patient data found")
      }

    } catch (err) {
      console.log("Error loading patient", err)

      if (err.response?.status === 404) {
        setError("Patient not found")
      } else {
        setError("Failed to load patient. Try again.")
      }

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchPatient()
  }, [id])

  /* ================= LOADING ================= */
  if (!id) return null

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <p className="text-gray-500 animate-pulse">
          ⏳ Loading patient profile...
        </p>
      </div>
    )
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>

        <button
          onClick={fetchPatient}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          🔄 Retry
        </button>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="p-6 text-center text-gray-500">
        No patient found
      </div>
    )
  }

  /* ================= MAIN ================= */

  // ✅ CHECK haddii uu yahay modal
  const isModal = !!propId

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: isModal ? 0.95 : 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-white shadow-xl rounded-2xl p-6 relative
        ${isModal 
          ? "w-full max-w-2xl max-h-[80vh] overflow-y-auto" 
          : "max-w-2xl mx-auto"}
      `}
    >

      {/* ❌ CLOSE BUTTON (ONLY MODAL) */}
      {isModal && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
        >
          ✖
        </button>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold">
          👤 Patient Profile
        </h2>

        {!isModal && (
          <button
            onClick={() => navigate("/patients")}
            className="text-blue-600 hover:underline"
          >
            ← Back
          </button>
        )}

      </div>

      {/* AVATAR */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {patient.fullName
            ? patient.fullName.charAt(0).toUpperCase()
            : "?"}
        </div>
      </div>

      {/* INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard label="Full Name" value={patient.fullName} />
        <InfoCard label="Phone" value={patient.phone} />
        <InfoCard label="Gender" value={patient.gender} capitalize />
        <InfoCard label="Address" value={patient.address} />
      </div>

      {/* LAB RESULTS */}
      <div className="mt-10">

        <h3 className="text-xl font-bold mb-4">
          🧪 Lab Results History
        </h3>

        {patient.labResults?.length > 0 ? (

          <div className="space-y-4">

            {patient.labResults.map((lab, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-50 border border-blue-100 p-4 rounded-xl"
              >

                <p className="text-sm text-gray-500 mb-3">
                  📅 {lab.date
                    ? new Date(lab.date).toLocaleDateString()
                    : "No date"}
                </p>

                {lab.tests?.length > 0 ? (

                  lab.tests.map((t, i) => (

                    <div
                      key={i}
                      className="grid grid-cols-4 gap-2 mb-2 text-sm bg-white p-2 rounded-lg"
                    >

                      <div className="font-semibold">{t.item}</div>

                      <div className="text-green-600 font-bold">
                        {t.result || "-"}
                      </div>

                      <div className="text-gray-500">
                        {t.reference || "-"}
                      </div>

                      <div className="text-gray-500">
                        {t.unit || "-"}
                      </div>

                    </div>

                  ))

                ) : (
                  <p className="text-gray-400">
                    No tests available
                  </p>
                )}

              </motion.div>

            ))}

          </div>

        ) : (

          <p className="text-gray-500 text-center">
            No lab results yet
          </p>

        )}

      </div>

    </motion.div>
  )

  /* ================= RETURN ================= */

  // ✅ haddii uu yahay modal → overlay
  if (isModal) {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    )
  }

  // ✅ haddii route page
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {content}
    </div>
  )
}

/* ================= REUSABLE COMPONENT ================= */
function InfoCard({ label, value, capitalize }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`font-semibold ${capitalize ? "capitalize" : ""}`}>
        {value || "-"}
      </p>
    </div>
  )
}