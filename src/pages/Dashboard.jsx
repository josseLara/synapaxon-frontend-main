"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Edit, BookOpen, CheckCircle, FileText } from "lucide-react"
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import Header from "../components/header"
import AIChatBot from "./AIChatBot"

export default function Dashboard() {
  const { currentUser, logout } = useAuth()
  const [activeComponent, setActiveComponent] = useState("welcome")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const localStorageName = localStorage.getItem('username') || currentUser?.name

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  // Update active component based on current route
  useEffect(() => {
    const path = location.pathname
    if (path === '/dashboard' || path === '/dashboard/') {
      setActiveComponent('welcome')
    } else if (path.includes('/starttest')) {
      setActiveComponent('test')
    } else if (path.includes('/history')) {
      setActiveComponent('history')
    } else if (path.includes('/testdetail')) {
      setActiveComponent('testdetail')
    } else if (path.includes('/create')) {
      setActiveComponent('create')
    } else if (path.includes('/my-questions')) {
      setActiveComponent('my-questions')
    } else if (path.includes('create/AIQuestionAssistant')) {
      setActiveComponent('AiQuestionAssistant')
    } else if (path.includes('/attempted-questions')) {
      setActiveComponent('attempted-questions')
    }
  }, [location.pathname])

  const handleNavClick = (component, path) => {
    setActiveComponent(component)
    navigate(path)
  }

  const renderWelcome = () => (
    <div className="p-8 rounded-lg">
      {/* Header Section */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100"
        >
          Welcome, {currentUser?.name || localStorageName || "User"} 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-300"
        >
          Select an option to begin your medical study session.
        </motion.p>
      </div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <DashboardCard
          icon={<FileText className="text-4xl text-blue-600 dark:text-blue-400 mb-3" />}
          title="Take Test"
          description="Start a customized test with medical questions selected by specialty."
          onClick={() => handleNavClick("test", "starttest")}
          gradient="from-blue-500/10 to-blue-600/10"
          hoverGradient="from-blue-500/20 to-blue-600/20"
        />
        <DashboardCard
          icon={<Clock className="text-4xl text-emerald-600 dark:text-emerald-400 mb-3" />}
          title="Test History"
          description="Review your progress and performance in previous evaluations."
          onClick={() => handleNavClick("history", "history")}
          gradient="from-emerald-500/10 to-emerald-600/10"
          hoverGradient="from-emerald-500/20 to-emerald-600/20"
        />
        <DashboardCard
          icon={<Edit className="text-4xl text-purple-600 dark:text-purple-400 mb-3" />}
          title="Create Question"
          description="Contribute to the platform by creating new medical questions."
          onClick={() => handleNavClick("create", "create")}
          gradient="from-purple-500/10 to-purple-600/10"
          hoverGradient="from-purple-500/20 to-purple-600/20"
        />
      </motion.div>

      {/* Extended Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <DashboardCard
          icon={<BookOpen className="text-4xl text-indigo-600 dark:text-indigo-400 mb-4" />}
          title="My Created Questions"
          description="View and manage all medical questions you've contributed to the educational platform."
          onClick={() => handleNavClick("my-questions", "my-questions")}
          gradient="from-indigo-500/10 to-indigo-600/10"
          hoverGradient="from-indigo-500/20 to-indigo-600/20"
          large
        />
        <DashboardCard
          icon={<CheckCircle className="text-4xl text-orange-600 dark:text-orange-400 mb-4" />}
          title="Attempted Questions"
          description="Analyze in detail all questions you've answered with performance statistics."
          onClick={() => handleNavClick("attempted-questions", "attempted-questions")}
          gradient="from-orange-500/10 to-orange-600/10"
          hoverGradient="from-orange-500/20 to-orange-600/20"
          large
        />
      </motion.div>
    </div>
  )

  const DashboardCard = ({ icon, title, description, onClick, gradient, hoverGradient, large = false }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
      relative overflow-hidden cursor-pointer group
      bg-gradient-to-br ${gradient} hover:bg-gradient-to-br hover:${hoverGradient}
      backdrop-blur-sm border border-white/20 dark:border-gray-700/30
      rounded-2xl shadow-lg hover:shadow-2xl
      transition-all duration-300 ease-out
      ${large ? "p-8" : "p-6"}
    `}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-md"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col items-start">
          {icon}
          <h3
            className={`font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors ${large ? "text-2xl" : "text-xl"}`}
          >
            {title}
          </h3>
          <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${large ? "text-base" : "text-sm"}`}>
            {description}
          </p>
        </div>

        {/* Hover indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200/50 dark:group-hover:border-blue-700/50 transition-colors duration-300"></div>
    </motion.div>
  )

  const isDashboardRoot = location.pathname === '/dashboard' || location.pathname === '/dashboard/'

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 dark:from-blue-900/20 dark:to-indigo-900/20"></div>
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <svg width="60" height="60" viewBox="0 0 60 60" className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-blue-200 dark:text-blue-800"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <Header
        activeComponent={activeComponent}
        handleNavClick={handleNavClick}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        logout={logout}
        currentUser={currentUser}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="">
          {isDashboardRoot ? renderWelcome() : <Outlet />}
        </div>
      <AIChatBot />
      </main>
    </div>
  )
}