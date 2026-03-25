import { useEffect, useState } from "react"

/* ================= VOICE ================= */
const speak = (text) => {
  const msg = new SpeechSynthesisUtterance(text)
  msg.rate = 0.9
  msg.pitch = 1
  msg.lang = "en-US"
  window.speechSynthesis.speak(msg)
}

export default function QueueEnhancements({ current, waiting }) {

  const [lastCalled, setLastCalled] = useState(null)
  const [tvMode, setTvMode] = useState(false)

  /* ================= VOICE AUTO CALL ================= */
  useEffect(() => {
    if (current && current.ticketNumber !== lastCalled) {
      speak(`Ticket number ${current.ticketNumber}, please come`)
      setLastCalled(current.ticketNumber)
    }
  }, [current])

  /* ================= ESTIMATE TIME ================= */
  const avgTimePerPatient = 5 // minutes
  const estimatedTime = waiting.length * avgTimePerPatient

  return (

    <div className="space-y-4">

      {/* 🔊 VOICE BUTTON */}
      <div className="flex gap-3">

        <button
          onClick={() =>
            current &&
            speak(`Ticket number ${current.ticketNumber}, please come`)
          }
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          🔊 Call Again
        </button>

        <button
          onClick={() => setTvMode(!tvMode)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          📺 {tvMode ? "Exit TV Mode" : "TV Mode"}
        </button>

      </div>

      {/* ⏱ ESTIMATED TIME */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-center">

        <p className="text-sm text-gray-600">
          Estimated Waiting Time
        </p>

        <p className="text-xl font-bold text-yellow-700">
          {estimatedTime} minutes
        </p>

      </div>

      {/* 📺 TV MODE */}
      {tvMode && (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-[999]">

          <h1 className="text-5xl mb-6">
            🏥 Smart Clinic
          </h1>

          <h2 className="text-3xl mb-4">
            Now Serving
          </h2>

          <p className="text-6xl font-bold text-green-400">
            #{current?.ticketNumber || "--"}
          </p>

          <p className="text-2xl mt-2">
            {current?.name || "Waiting..."}
          </p>

          <p className="mt-6 text-gray-400">
            Waiting: {waiting.length} patients
          </p>

          <button
            onClick={() => setTvMode(false)}
            className="mt-10 bg-red-600 px-6 py-3 rounded-lg"
          >
            Exit
          </button>

        </div>
      )}

    </div>

  )
}