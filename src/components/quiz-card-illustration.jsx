"use client"

import { motion } from "framer-motion"

export function QuizCardIllustration() {
  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      {/* Main Quiz Card */}
      <motion.div
        className="relative z-10 w-80 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.05, rotateY: 5 }}
      >
        {/* Card Content */}
        <div className="p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">Q</span>
            </div>
            <div className="text-xs opacity-75">Medicine #1</div>
          </div>

          <h3 className="text-lg font-semibold mb-2">What is the main function of the heart?</h3>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-white/30 rounded-full"></div>
              <span className="text-sm opacity-90">Pump blood through the body</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm opacity-90">Produce hormones</span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>

      {/* Floating Quiz Elements */}
      <motion.div
        className="absolute top-12 left-12 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        whileHover={{ scale: 1.1 }}
      >
        <span className="text-2xl">🩺</span>
      </motion.div>

      <motion.div
        className="absolute bottom-16 right-8 w-20 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        whileHover={{ scale: 1.1 }}
      >
        <span className="text-sm font-semibold text-gray-700">95%</span>
      </motion.div>

      {/* Connecting Lines */}
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
      >
        <motion.path
          d="M 100 150 Q 200 100 300 180"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
          opacity="0.6"
        />
        <motion.path
          d="M 350 200 Q 400 250 450 220"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
          opacity="0.6"
        />
      </motion.svg>

      {/* Background Dots */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}
