"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Moon, ChevronLeft, ChevronRight } from "lucide-react"
import { HorizontalThemeWipeToggle } from "@/components/ui/theme-wipe-toggle"
import { Meteors } from "@/components/ui/meteors"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { StarButton } from "@/components/ui/star-button"
import { motion, AnimatePresence } from "framer-motion"

interface MoonPhase {
  phase: number
  illumination: number
  age: number
  distance: number
  angular_diameter: number
}

interface MoonEvent {
  date: string
  type: "new" | "first_quarter" | "full" | "last_quarter"
  name: string
  illumination: number
}

export default function MoonTracker() {
  const [currentMoon, setCurrentMoon] = useState<MoonPhase | null>(null)
  const [upcomingEvents, setUpcomingEvents] = useState<MoonEvent[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [direction, setDirection] = useState(0)
  const [loading, setLoading] = useState(true)

  // Calculate moon phase for a given date
  const calculateMoonPhase = (date: Date): MoonPhase => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    // Julian day calculation
    const a = Math.floor((14 - month) / 12)
    const y = year - a
    const m = month + 12 * a - 3
    const jd =
      day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) +
      1721119

    // Moon phase calculation (simplified)
    const daysSinceNewMoon = (jd - 2451549.5) % 29.53058867
    const phase = daysSinceNewMoon / 29.53058867
    const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2

    return {
      phase: phase,
      illumination: illumination * 100,
      age: daysSinceNewMoon,
      distance: 384400 + Math.sin(phase * 2 * Math.PI) * 21000,
      angular_diameter: 0.5181 / (1 + 0.0549 * Math.sin(phase * 2 * Math.PI)),
    }
  }

  // Generate upcoming moon events
  const generateUpcomingEvents = (startDate: Date): MoonEvent[] => {
    const events: MoonEvent[] = []
    const currentDate = new Date(startDate)

    for (let i = 0; i < 60; i++) {
      const moonPhase = calculateMoonPhase(currentDate)
      const phaseValue = moonPhase.phase

      if (Math.abs(phaseValue - 0) < 0.02 || Math.abs(phaseValue - 1) < 0.02) {
        events.push({
          date: currentDate.toISOString().split("T")[0],
          type: "new",
          name: "New Moon",
          illumination: 0,
        })
      } else if (Math.abs(phaseValue - 0.25) < 0.02) {
        events.push({
          date: currentDate.toISOString().split("T")[0],
          type: "first_quarter",
          name: "First Quarter",
          illumination: 50,
        })
      } else if (Math.abs(phaseValue - 0.5) < 0.02) {
        events.push({
          date: currentDate.toISOString().split("T")[0],
          type: "full",
          name: "Full Moon",
          illumination: 100,
        })
      } else if (Math.abs(phaseValue - 0.75) < 0.02) {
        events.push({
          date: currentDate.toISOString().split("T")[0],
          type: "last_quarter",
          name: "Last Quarter",
          illumination: 50,
        })
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return events.slice(0, 6) // reduced to 6 events for cleaner layout
  }

  const getMoonPhaseName = (phase: number): string => {
    if (phase < 0.03 || phase > 0.97) return "New Moon"
    if (phase < 0.22) return "Waxing Crescent"
    if (phase < 0.28) return "First Quarter"
    if (phase < 0.47) return "Waxing Gibbous"
    if (phase < 0.53) return "Full Moon"
    if (phase < 0.72) return "Waning Gibbous"
    if (phase < 0.78) return "Last Quarter"
    return "Waning Crescent"
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      filter: "blur(4px)",
    }),
  }

  const MoonVisual = ({ phase, illumination }: { phase: number, illumination: number }) => {
    const getMoonPath = (phase: number) => {
      const radius = 40
      const centerX = 50
      const centerY = 50

      if (phase < 0.01 || phase > 0.99) {
        return ""
      }

      if (phase >= 0.49 && phase <= 0.51) {
        return `M ${centerX - radius} ${centerY} 
                A ${radius} ${radius} 0 1 1 ${centerX + radius} ${centerY} 
                A ${radius} ${radius} 0 1 1 ${centerX - radius} ${centerY}`
      }

      let terminatorX: number
      let sweepFlag: number

      if (phase < 0.5) {
        terminatorX = centerX + radius * Math.cos(Math.PI * (1 - 2 * phase))
        sweepFlag = phase < 0.25 ? 0 : 1
      } else {
        terminatorX = centerX + radius * Math.cos(Math.PI * (2 * phase - 1))
        sweepFlag = phase > 0.75 ? 0 : 1
      }

      const ellipseRx = Math.abs(terminatorX - centerX)

      if (phase < 0.5) {
        return `M ${centerX} ${centerY - radius}
                A ${radius} ${radius} 0 0 1 ${centerX} ${centerY + radius}
                A ${ellipseRx} ${radius} 0 0 ${sweepFlag} ${centerX} ${centerY - radius}`
      } else {
        return `M ${centerX} ${centerY - radius}
                A ${ellipseRx} ${radius} 0 0 ${sweepFlag} ${centerX} ${centerY + radius}
                A ${radius} ${radius} 0 0 1 ${centerX} ${centerY - radius}`
      }
    }

    const glowOpacity = Math.max(0.1, (illumination / 100) * 0.7)
    const glowScale = 1 + (illumination / 100) * 0.4

    return (
      <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
        {/* Breathing glowing aura */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-400 blur-2xl z-0"
          animate={{ opacity: [glowOpacity * 0.4, glowOpacity, glowOpacity * 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: `scale(${glowScale})` }}
        />
        
        <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-xl relative z-10">
          <circle cx="50" cy="50" r="40" fill="#1a1a1a" stroke="#333333" strokeWidth="0.5" />
          {getMoonPath(phase) && <path d={getMoonPath(phase)} fill="#f0f0f0" stroke="#e0e0e0" strokeWidth="0.5" />}
          
          <circle cx="42" cy="38" r="2.5" fill="#e8e8e8" opacity="0.7" />
          <circle cx="60" cy="45" r="1.8" fill="#e8e8e8" opacity="0.5" />
          <circle cx="48" cy="62" r="1.2" fill="#e8e8e8" opacity="0.6" />
          <circle cx="35" cy="58" r="1.5" fill="#e8e8e8" opacity="0.4" />
          <circle cx="55" cy="32" r="1" fill="#e8e8e8" opacity="0.5" />

          <circle cx="46" cy="48" r="0.8" fill="#ececec" opacity="0.3" />
          <circle cx="54" cy="52" r="0.6" fill="#ececec" opacity="0.4" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </svg>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays < 0) return `${Math.abs(diffDays)}d ago`
    return `${diffDays}d`
  }

  const navigateDate = (navDir: "prev" | "next") => {
    setDirection(navDir === "next" ? 1 : -1)
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (navDir === "next" ? 1 : -1))
    setSelectedDate(newDate)
  }

  const MoonPhaseIcon = ({ eventType }: { eventType: "new" | "first_quarter" | "full" | "last_quarter" }) => {
    const getPhaseValue = (type: typeof eventType): number => {
      switch (type) {
        case "new":
          return 0
        case "first_quarter":
          return 0.25
        case "full":
          return 0.5
        case "last_quarter":
          return 0.75
        default:
          return 0
      }
    }

    const getMoonPath = (phase: number) => {
      const radius = 12
      const centerX = 16
      const centerY = 16

      if (phase < 0.01 || phase > 0.99) {
        return ""
      }

      if (phase >= 0.49 && phase <= 0.51) {
        return `M ${centerX - radius} ${centerY} 
                A ${radius} ${radius} 0 1 1 ${centerX + radius} ${centerY} 
                A ${radius} ${radius} 0 1 1 ${centerX - radius} ${centerY}`
      }

      let terminatorX: number
      let sweepFlag: number

      if (phase < 0.5) {
        terminatorX = centerX + radius * Math.cos(Math.PI * (1 - 2 * phase))
        sweepFlag = phase < 0.25 ? 0 : 1
      } else {
        terminatorX = centerX + radius * Math.cos(Math.PI * (2 * phase - 1))
        sweepFlag = phase > 0.75 ? 0 : 1
      }

      const ellipseRx = Math.abs(terminatorX - centerX)

      if (phase < 0.5) {
        return `M ${centerX} ${centerY - radius}
                A ${radius} ${radius} 0 0 1 ${centerX} ${centerY + radius}
                A ${ellipseRx} ${radius} 0 0 ${sweepFlag} ${centerX} ${centerY - radius}`
      } else {
        return `M ${centerX} ${centerY - radius}
                A ${ellipseRx} ${radius} 0 0 ${sweepFlag} ${centerX} ${centerY + radius}
                A ${radius} ${radius} 0 0 1 ${centerX} ${centerY - radius}`
      }
    }

    const phase = getPhaseValue(eventType)

    return (
      <svg width="32" height="32" viewBox="0 0 32 32" className="drop-shadow-sm">
        {/* Moon surface (dark side) */}
        <circle cx="16" cy="16" r="12" fill="#1a1a1a" stroke="#333333" strokeWidth="0.3" />

        {/* Illuminated portion */}
        {getMoonPath(phase) && <path d={getMoonPath(phase)} fill="#f0f0f0" stroke="#e0e0e0" strokeWidth="0.3" />}

        {/* Small crater details */}
        <circle cx="13" cy="12" r="0.8" fill="#e8e8e8" opacity="0.6" />
        <circle cx="19" cy="14" r="0.6" fill="#e8e8e8" opacity="0.4" />
        <circle cx="16" cy="20" r="0.5" fill="#e8e8e8" opacity="0.5" />
      </svg>
    )
  }

  useEffect(() => {
    setLoading(true)
    const moonData = calculateMoonPhase(selectedDate)
    const events = generateUpcomingEvents(new Date())

    setCurrentMoon(moonData)
    setUpcomingEvents(events)
    setLoading(false)
  }, [selectedDate])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 animate-spin">
            <Moon className="w-full h-full text-gray-400" />
          </div>
          <p className="text-gray-600 font-mono text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 relative overflow-hidden">
      <div className="hidden dark:block absolute inset-0 pointer-events-none">
        <Meteors number={25} />
      </div>
      <div className="block dark:hidden absolute inset-0 pointer-events-none">
        <AnimatedGridPattern 
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
          )} 
        />
      </div>
      <header className="border-b border-gray-100 dark:border-gray-900 relative z-10">
        <div className="max-w-4xl mx-auto px-6 py-12 relative">
          <div className="absolute right-6 top-6 sm:right-12 sm:top-12">
            <HorizontalThemeWipeToggle direction="left" />
          </div>
          <div className="text-center flex flex-col items-center">
            <h1 className="text-3xl font-mono text-gray-900 dark:text-gray-100 tracking-wide font-semibold">Moon Tracker</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-mono text-sm">{"Lunar phase calendar, by I Putu Dana Putra."}</p>
            <div className="mt-6">
              <StarButton text="FAVORITE" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16 relative z-10">
        <section className="text-center space-y-8">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => navigateDate("prev")}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.h2 
                key={selectedDate.toISOString()}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="text-xl font-mono font-light text-gray-900 dark:text-gray-100 min-w-[200px]"
              >
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </motion.h2>
            </AnimatePresence>
            <button
              onClick={() => navigateDate("next")}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
          </div>

          <div className="relative min-h-[350px] flex items-center justify-center">
            <AnimatePresence mode="popLayout" custom={direction}>
              {currentMoon && (
                <motion.div
                  key={selectedDate.toISOString() + "-data"}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="w-full space-y-6 absolute"
                >
                  <MoonVisual phase={currentMoon.phase} illumination={currentMoon.illumination} />
                  
                  <div>
                    <h3 className="text-2xl font-mono text-gray-900 dark:text-gray-100 mb-2 font-medium">
                      {getMoonPhaseName(currentMoon.phase)}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                      {currentMoon.illumination.toFixed(0)}% illuminated
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-8 max-w-md mx-auto pt-8 border-t border-gray-100 dark:border-neutral-900">
                    <div className="text-center">
                      <p className="text-gray-400 dark:text-gray-500 font-mono text-xs uppercase tracking-wide mb-1">Age</p>
                      <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">{currentMoon.age.toFixed(0)}d</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 dark:text-gray-500 font-mono text-xs uppercase tracking-wide mb-1">Distance</p>
                      <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                        {Math.round(currentMoon.distance / 1000)}k km
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 dark:text-gray-500 font-mono text-xs uppercase tracking-wide mb-1">Phase</p>
                      <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                        {(currentMoon.phase * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-mono text-gray-900 dark:text-gray-100 mb-8 text-center font-semibold">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-neutral-900/50 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-900 flex items-center justify-center">
                    <MoonPhaseIcon eventType={event.type} />
                  </div>
                  <div>
                    <p className="font-mono text-gray-900 dark:text-gray-200 text-sm font-medium">{event.name}</p>
                    <p className="font-mono text-gray-500 dark:text-gray-400 text-xs">{formatDate(event.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-gray-600 dark:text-gray-400 text-xs">{getDaysUntil(event.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center pt-8">
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-6 py-2 border border-gray-200 dark:border-neutral-900 hover:border-gray-300 dark:hover:border-gray-700 font-mono text-sm text-gray-700 dark:text-gray-300 transition-colors"
          >
            Today
          </button>
        </div>
      </main>
    </div>
  )
}
