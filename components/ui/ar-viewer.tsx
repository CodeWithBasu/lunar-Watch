"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Crosshair, Compass, AlertCircle } from "lucide-react"

interface ARViewerProps {
  onClose: () => void;
}

export function ARViewer({ onClose }: ARViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [heading, setHeading] = useState<number>(0)
  const [pitch, setPitch] = useState<number>(0)
  
  // Mock Moon Position (South, 45 degrees up)
  const MOON_AZIMUTH = 180;
  const MOON_ALTITUDE = 45;

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setHasPermission(true)
      } catch (err) {
        console.error("Camera access denied", err)
        setHasPermission(false)
      }
    }

    startCamera();

    // Orientation handler
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // webkitCompassHeading for iOS, alpha for Android (absolute needs to be handled, but we approximate for UI)
      let currentHeading = 0;
      if ((event as any).webkitCompassHeading) {
        currentHeading = (event as any).webkitCompassHeading;
      } else if (event.alpha !== null) {
        // Fallback, not true north but gives movement
        currentHeading = 360 - event.alpha;
      }
      setHeading(Math.round(currentHeading))
      
      if (event.beta !== null) {
        // Beta is front-to-back tilt in degrees, where 90 is looking straight forward
        setPitch(Math.round(event.beta))
      }
    }

    // Request permissions for iOS 13+ devices
    const requestOrientation = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        try {
          const permissionState = await (DeviceOrientationEvent as any).requestPermission()
          if (permissionState === "granted") {
            window.addEventListener("deviceorientation", handleOrientation)
          }
        } catch (error) {
          console.error(error)
        }
      } else {
        window.addEventListener("deviceorientation", handleOrientation)
      }
    }
    requestOrientation()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      window.removeEventListener("deviceorientation", handleOrientation)
    }
  }, [])

  // Calculate distance from center
  const headingDiff = heading - MOON_AZIMUTH;
  const pitchDiff = pitch - MOON_ALTITUDE;
  
  // Is the moon in the viewport? (Roughly +/- 30 degrees)
  const isVisible = Math.abs(headingDiff) < 30 && Math.abs(pitchDiff) < 30;

  // Map differences to screen coordinates (-50% to +50%)
  const xPos = (headingDiff / 30) * 50; 
  const yPos = (pitchDiff / 30) * 50;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Camera Feed */}
      {hasPermission !== false ? (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="font-mono text-sm">Camera access denied. Please allow camera permissions to use AR Sky Viewer.</p>
        </div>
      )}

      {/* AR HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2 text-blue-400">
            <Compass className="w-5 h-5 animate-pulse" />
            <span className="font-mono text-xl font-bold tracking-widest">{heading}°</span>
          </div>
          <button 
            onClick={onClose}
            className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-red-500/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Reticle */}
        <div className="flex-1 flex items-center justify-center relative">
          <Crosshair className={`w-24 h-24 transition-colors duration-500 ${isVisible ? "text-green-500" : "text-white/30"}`} strokeWidth={1} />
          
          {/* Virtual Moon Object */}
          <motion.div 
            className="absolute"
            animate={{ 
              x: `${xPos}vw`, 
              y: `${yPos}vh`,
              opacity: isVisible ? 1 : 0
            }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/moon-reference.png" alt="AR Moon" className="w-12 h-12 rounded-full shadow-[0_0_20px_white]" />
              <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-mono text-green-400 bg-black/50 px-2 py-0.5 rounded">
                TARGET LOCKED
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="p-6 bg-gradient-to-t from-black/80 to-transparent text-center">
          <p className="font-mono text-xs text-blue-300 tracking-widest uppercase">
            {isVisible ? "Moon in view" : "Turn around to find the moon"}
          </p>
          <p className="font-mono text-[10px] text-gray-500 mt-2">
            AZIMUTH: {MOON_AZIMUTH}° • ALTITUDE: {MOON_ALTITUDE}°
          </p>
        </div>
      </div>
    </motion.div>
  )
}

