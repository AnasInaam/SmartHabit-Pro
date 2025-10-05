import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ConfettiPiece = ({ delay, duration, x, y, rotation, color }) => (
  <motion.div
    initial={{ 
      opacity: 1, 
      x: '50vw', 
      y: '50vh',
      rotate: 0,
      scale: 1
    }}
    animate={{ 
      opacity: 0,
      x: x,
      y: y,
      rotate: rotation,
      scale: 0
    }}
    transition={{ 
      duration: duration,
      delay: delay,
      ease: "easeOut"
    }}
    className="absolute w-3 h-3 rounded-sm"
    style={{ backgroundColor: color }}
  />
)

function Confetti({ trigger, duration = 3000 }) {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    if (trigger) {
      setShow(true)
      const timer = setTimeout(() => setShow(false), duration)
      return () => clearTimeout(timer)
    }
  }, [trigger, duration])

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#E76F51', '#2A9D8F'
  ]

  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 2,
    x: `${Math.random() * 100 - 50}vw`,
    y: `${Math.random() * 100 + 50}vh`,
    rotation: Math.random() * 720 - 360,
    color: colors[Math.floor(Math.random() * colors.length)]
  }))

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {pieces.map((piece) => (
            <ConfettiPiece key={piece.id} {...piece} />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

export default Confetti
