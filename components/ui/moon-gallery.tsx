"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Camera, Image as ImageIcon, Upload, Loader2, Star } from "lucide-react"
import { motion } from "framer-motion"

interface MoonPhoto {
  id: string
  url: string
  author: string
  created_at: string
  likes: number
}

const MOCK_PHOTOS: MoonPhoto[] = [
  { id: "1", url: "/moon-reference.png", author: "Basudev", created_at: new Date().toISOString(), likes: 42 },
  { id: "2", url: "https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg", author: "NASA", created_at: new Date().toISOString(), likes: 1337 }
]

export function MoonGallery() {
  const [photos, setPhotos] = useState<MoonPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const { data, error } = await supabase
          .from("moon_photos")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10)

        if (error) throw error
        
        if (data && data.length > 0) {
          setPhotos(data)
        } else {
          setPhotos(MOCK_PHOTOS)
        }
      } catch (error) {
        console.warn("Failed to fetch from Supabase, using mock data.", error)
        setPhotos(MOCK_PHOTOS)
      } finally {
        setLoading(false)
      }
    }
    fetchPhotos()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { error: uploadError, data } = await supabase.storage
        .from("moon-gallery")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("moon-gallery")
        .getPublicUrl(fileName)

      // 3. Insert into Database
      const newPhoto = {
        url: publicUrl,
        author: "Anonymous Astronomer",
        likes: 0
      }

      const { error: dbError } = await supabase
        .from("moon_photos")
        .insert([newPhoto])

      if (dbError) throw dbError
      
      // Update local state optimistically
      setPhotos(prev => [{ id: Math.random().toString(), ...newPhoto, created_at: new Date().toISOString() }, ...prev])
      alert("Photo uploaded successfully!")
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload photo. Ensure Supabase is configured.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
          <Camera className="w-6 h-6" />
          <h2 className="text-2xl font-mono font-bold uppercase tracking-wider">Global Gallery</h2>
        </div>
        
        <label className="cursor-pointer group">
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-mono text-sm font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] active:scale-95">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "UPLOADING..." : "UPLOAD PHOTO"}
          </div>
        </label>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-square bg-gray-100 dark:bg-neutral-900 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
          {photos.map((photo, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={photo.id} 
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={photo.url} 
                alt="Moon" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <p className="text-white font-mono text-xs truncate mr-2">by {photo.author}</p>
                  <div className="flex items-center gap-1 text-yellow-400 bg-black/50 px-2 py-1 rounded-full backdrop-blur">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    <span className="font-mono text-xs font-bold">{photo.likes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

