"use client"

import { motion } from "framer-motion"

export function LearningProcessIllustration() {
  return (
    <div className="relative w-full h-80 flex items-center justify-center">
      {/* Central Hub */}
      <motion.div
        className="relative z-10 w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-xl flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="text-white text-2xl font-bold">S</span>
      </motion.div>

      {/* Orbiting Elements */}
      {[
        { icon: "🩺", label: "Estudiar", angle: 0, delay: 0.2 },
        { icon: "🧠", label: "Practicar", angle: 120, delay: 0.4 },
        { icon: "📊", label: "Evaluar", angle: 240, delay: 0.6 },
      ].map((item, index) => (
        <motion.div
          key={item.label}
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: item.delay, duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center"
            style={{
              x: Math.cos((item.angle * Math.PI) / 180) * 120,
              y: Math.sin((item.angle * Math.PI) / 180) * 120,
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            whileHover={{ scale: 1.2 }}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs font-medium text-gray-600">{item.label}</span>
          </motion.div>

          {/* Connecting Lines */}
          <motion.div
            className="absolute top-8 left-8 w-px bg-gradient-to-r from-blue-400 to-transparent"
            style={{
              height: "120px",
              transformOrigin: "top",
              rotate: `${item.angle + 180}deg`,
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: item.delay + 0.3, duration: 0.8 }}
          />
        </motion.div>
      ))}

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}
