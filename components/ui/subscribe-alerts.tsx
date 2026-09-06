"use client"

import { useState } from "react"
import { Bell, Mail, ArrowRight, CheckCircle2 } from "lucide-react"

export function SubscribeAlerts() {
  const [contact, setContact] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contact) return

    setLoading(true)
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, type: "email" })
      })
      
      if (!res.ok) throw new Error("Failed to subscribe")
      
      setSuccess(true)
      setContact("")
    } catch (err) {
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-xl mx-auto mt-16 p-8 rounded-3xl border border-green-500/30 bg-green-500/5 backdrop-blur text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white font-mono">Subscription Active!</h3>
        <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">
          You will now receive alerts for Supermoons, Eclipses, and special lunar events.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-4 text-xs font-mono font-bold text-blue-500 hover:text-blue-400"
        >
          SUBSCRIBE ANOTHER
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-16 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#0b172a]/50 backdrop-blur shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-2 text-blue-600 dark:text-blue-400">
        <Bell className="w-5 h-5 animate-bounce" />
        <h3 className="font-mono text-sm tracking-widest uppercase font-semibold">Lunar Alerts by BASUDEV</h3>
      </div>
      
      <h4 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
        Never miss a cosmic event.
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 font-mono">
        Get automated Email notifications for eclipses, supermoons, and perfect stargazing conditions.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 flex items-center justify-center pointer-events-none">
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <input 
            type="email"
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="astronomer@nasa.gov"
            className="w-full pl-12 pr-16 py-4 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
          />
          <button 
            type="submit"
            disabled={loading || !contact}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-neutral-700 text-white rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  )
}

