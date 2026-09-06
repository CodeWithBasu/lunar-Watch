"use client"

import { useEffect, useState } from "react"
import { getAstronomyPictureOfTheDay, NasaApodResponse } from "@/lib/nasa-api"
import { ExternalLink, Rocket } from "lucide-react"
import { motion } from "framer-motion"

export function NasaFeed() {
  const [data, setData] = useState<NasaApodResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getAstronomyPictureOfTheDay()
        setData(result)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-12 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur animate-pulse h-64 flex items-center justify-center">
        <Rocket className="w-8 h-8 text-gray-400 animate-bounce" />
      </div>
    )
  }

  if (!data) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl mx-auto mt-12 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#0b172a]/50 backdrop-blur shadow-xl"
    >
      <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
        <Rocket className="w-5 h-5" />
        <h3 className="font-mono text-sm tracking-widest uppercase font-semibold">NASA Data Feed</h3>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
          {data.title}
        </h4>
        
        {data.media_type === "image" ? (
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={data.url} 
              alt={data.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        ) : (
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe 
              src={data.url} 
              title={data.title} 
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        )}
        
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
          {data.explanation}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs font-mono text-gray-500">{data.date}</span>
          {data.hdurl && (
            <a 
              href={data.hdurl} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              HD IMAGE <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

