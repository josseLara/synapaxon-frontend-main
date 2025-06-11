"use client"

import {
  ArrowRight,
  CheckCircle,
  Stethoscope,
  Users,
  Star,
  Check,
  Brain,
  GraduationCap,
  Award,
  TrendingUp,
  SunIcon,
  MoonIcon,
  Rocket,
  Zap,
  Crown,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { useNavigate } from "react-router-dom"

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const navigate = useNavigate();

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

  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`)
    navigate(path)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const testimonials = [
    {
      name: "Dr. John Smith",
      position: "Internal Medicine Resident, University Hospital",
      image: "/testimonial-1.webp",
      text: "Since using Synapaxon, I've improved my scores by 95%. The platform is intuitive and the questions are well structured by specialties.",
    },
    {
      name: "Dr. Emily Johnson",
      position: "5th Year Medical Student",
      image: "/testimonial-3.jpeg",
      text: "As a student, I needed a tool to help me review all subjects. Synapaxon has allowed me to study more efficiently.",
    },
    {
      name: "Dr. Michael Brown",
      position: "Cardiology Specialist, San Rafael Clinic",
      image: "/testimonial-2.webp",
      text: "The quality of questions and organization by organ systems has transformed how I teach residents.",
    },
  ]

  const subscriptionsData = [
    {
      id: 1,
      name: "Free",
      price: 0,
      description: "Ideal for getting started",
      maxQuestions: 5,
      maxChats: 5,
      maxAgents: 5,
      daysFree: 5,
    },
    {
      id: 2,
      name: "Pro",
      price: 9,
      description: "For regular users",
      maxQuestions: 50,
      maxChats: 50,
      maxAgents: 20,
      daysFree: 0,
    },
    {
      id: 3,
      name: "Premium",
      price: 29,
      description: "For power users",
      maxQuestions: "100",
      maxChats: 100,
      maxAgents: 50,
      daysFree: 0,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8 } },
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <header className="py-4 bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <a href="/" className="flex items-center space-x-2 gap-2 font-semibold text-xl text-white">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            Synapaxon
          </a>
          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => scrollToSection("features")}
              className="text-white hover:text-blue-200 text-sm transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-white hover:text-blue-200 text-sm transition-colors"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-white hover:text-blue-200 text-sm transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-white hover:text-blue-200 text-sm transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-white hover:text-blue-200 text-sm transition-colors"
            >
              Contact
            </button>
          </nav>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              className="bg-blue-700 text-white border-white hover:bg-blue-600 text-sm transition-all duration-300"
              onClick={() => handleNavigation("/register")}
            >
              Free Access
            </Button>
            <Button
              variant="outline"
              className="bg-white border-white text-blue-700 hover:bg-blue-600 hover:text-white text-sm transition-all duration-300"
              onClick={() => handleNavigation("/login")}
            >
              Login
            </Button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
            >
              {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-15 md:py-25 pb-5 flex-grow bg-gradient-to-b from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 relative overflow-hidden min-h-fit pt-[45px] transition-all duration-300">
        <motion.div
          className="absolute inset-0 opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/20 text-4xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              >
                {["🩺", "🧠", "💊", "🫀", "🦴", "👁️"][Math.floor(Math.random() * 6)]}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <motion.span
                className="inline-block px-4 py-1 rounded-full bg-blue-700/50 dark:bg-blue-800/50 text-white text-sm font-medium mb-4 backdrop-blur-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Simplified Medical Education
              </motion.span>
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-white leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                The <span className="text-blue-200 font-extrabold">Medical</span> Platform for Interactive Learning
              </motion.h1>
            </div>
            <motion.p
              className="text-blue-100 text-lg md:pr-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Master medical knowledge with our intuitive platform, designed for students, residents and professionals looking to optimize their medical learning.
            </motion.p>
            <motion.div
              className="pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Button
                className="bg-blue-700 hover:bg-blue-600 dark:bg-blue-800 dark:hover:bg-blue-700 text-white px-8 py-6 rounded-md flex items-center gap-2 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => handleNavigation("/register")}
              >
                Start Free <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
            <span className="pt-5 w-[20px] h-[20px]"></span>
            {/* <motion.div
              className="pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <p className="text-blue-200 text-sm">Trusted by thousands of medical professionals:</p>
              <div className="flex flex-wrap gap-6 items-center mt-4">
                <motion.div
                  className="bg-white/10 px-4 py-2 rounded backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="text-white text-sm">National University</div>
                </motion.div>
                <motion.div
                  className="bg-white/10 px-4 py-2 rounded backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="text-white text-sm">St. John's Hospital</div>
                </motion.div>
                <motion.div
                  className="bg-white/10 px-4 py-2 rounded backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="text-white text-sm">Mayo Clinic</div>
                </motion.div>
                <motion.div
                  className="bg-white/10 px-4 py-2 rounded backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="text-white text-sm">Harvard Medical</div>
                </motion.div>
              </div>
            </motion.div> */}
          </motion.div>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="bg-gradient-to-r from-blue-800/50 to-blue-700/50 dark:from-blue-900/50 dark:to-blue-800/50 p-6 rounded-lg border border-blue-600/30 shadow-lg backdrop-blur-sm"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-blue-200 h-5 w-5" />
                {/* <span className="text-blue-200 text-sm">Diagnostic Accuracy</span> */}
                <div className="text-white text-3xl font-bold">Upload your own questions and explanations</div>
              </div>
              {/* <div className="text-white text-3xl font-bold">98.5%</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-blue-200 text-xs">↑ 15%</span>
                <span className="text-blue-300 text-xs">vs. traditional methods</span>
              </div> */}
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-blue-800/50 to-blue-700/50 dark:from-blue-900/50 dark:to-blue-800/50 p-6 rounded-lg border border-blue-600/30 shadow-lg backdrop-blur-sm"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-blue-200 h-5 w-5" />
                {/* <span className="text-blue-200 text-sm">Select your test</span> */}
                <div className="text-white text-3xl font-bold">Select your test</div>
              </div>
              {/* <div className="text-white text-3xl font-bold">40%</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-blue-200 text-xs">↓ 40%</span>
                <span className="text-blue-300 text-xs">less time, better results</span>
              </div> */}
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-blue-800/50 to-blue-700/50 dark:from-blue-900/50 dark:to-blue-800/50 p-6 rounded-lg border border-blue-600/30 shadow-lg backdrop-blur-sm"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-blue-200 h-5 w-5" />
                {/* <span className="text-blue-200 text-sm">get feedback</span> */}
                <div className="text-white text-3xl font-bold">Get feedback</div>
              </div>
              {/*<div className="flex items-center gap-1 mt-1">
                <span className="text-blue-200 text-xs">↑ 60%</span>
                <span className="text-blue-300 text-xs">better long-term retention</span>
              </div> */}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 w-full h-20 bg-white dark:bg-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)",
            height: "5rem",
          }}
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-medium mb-4 transition-colors duration-300">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              The Best Choice
            </h2>
            <h3 className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
              For Efficient Medical Education
            </h3>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              variants={item}
              whileHover={{ y: -10 }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/50 inline-block p-3 rounded-lg mb-6 transition-colors duration-300">
                <Brain className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
              {/* <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                5.2K
              </div>
              <div className="flex items-center gap-1 mb-6">
                <span className="text-blue-600 dark:text-blue-400 text-sm">↑ 35%</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
                  medical questions
                </span>
              </div> */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Question Bank
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Ability to access thousands of questions that you created, organized by Basic Sciences, Organ Systems, and Clinical Specialties, with detailed explanations.
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              variants={item}
              whileHover={{ y: -10 }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/50 inline-block p-3 rounded-lg mb-6 transition-colors duration-300">
                <Users className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
              {/* <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                12.8K
              </div>
              <div className="flex items-center gap-1 mb-6">
                <span className="text-blue-600 dark:text-blue-400 text-sm">↑ 55%</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
                  active students
                </span>
              </div> */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Specialized Medical Interface
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Designed specifically for medical students with precise terminology and intuitive navigation by specialties.
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              variants={item}
              whileHover={{ y: -10 }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/50 inline-block p-3 rounded-lg mb-6 transition-colors duration-300">
                <TrendingUp className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
              {/* <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                <div className="w-full h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg font-bold">📈 +95%</span>
                </div>
              </div> */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Guaranteed Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Since you are the one that knows your weakness and strength, you can adjust your content accordingly
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-medium mb-4 transition-colors duration-300">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              Simplify Your Medical Learning
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              Our platform is designed to make medical study efficient, structured and evidence-based.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-blue-200 dark:bg-blue-700 -z-10 transform -translate-y-1/2 transition-colors duration-300"></div>

            <motion.div
              className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md text-center relative z-10 transition-colors duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-blue-600 dark:bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold transition-colors duration-300">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Select Your Specialty
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Choose from Basic Sciences, Organ Systems or Clinical Specialties according to your study level.
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md text-center relative z-10 transition-colors duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-blue-600 dark:bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold transition-colors duration-300">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Integrated AI assistant
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Use our AI agent to help you create and upload content in seconds
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md text-center relative z-10 transition-colors duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-blue-600 dark:bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold transition-colors duration-300">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Analyze Your Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Get detailed reports of your performance by specialty and identify improvement areas with personalized recommendations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section
        id="testimonials"
        className="py-20 bg-gradient-to-b from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 text-white transition-all duration-300"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-blue-800/50 dark:bg-blue-900/50 text-blue-200 text-sm font-medium mb-4 backdrop-blur-sm">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Students, residents and specialists worldwide trust Synapaxon for their medical training.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-blue-800/50 dark:bg-blue-900/50 p-8 rounded-xl backdrop-blur-sm border border-blue-600/30"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center border-2 border-blue-400">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <motion.p
                    className="text-lg mb-6 italic"
                    key={activeTestimonial}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    "{testimonials[activeTestimonial].text}"
                  </motion.p>
                  <motion.div
                    key={`name-${activeTestimonial}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="font-bold text-lg">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-blue-300">{testimonials[activeTestimonial].position}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTestimonial === index ? "bg-blue-300 w-6" : "bg-blue-700"
                    }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-medium mb-4 transition-colors duration-300">
              Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              Simple and Transparent Plans
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              Start free and scale according to your learning needs. No surprises or hidden costs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptionsData.map((sub) => (
              <Card
                key={sub.id}
                className={`relative flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800 ${sub.name.toLowerCase() === "pro"
                  ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900 shadow-lg shadow-blue-500/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                  }`}
              >
                {sub.name.toLowerCase() === "pro" && (
                  <div className="absolute -right-1 -top-1 rounded-bl-md rounded-tr-md bg-blue-500 px-3 py-1 text-xs font-medium text-white shadow-md">
                    Recommended
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white transition-colors duration-300">
                    {sub.name.toLowerCase() === "free" ? (
                      <GraduationCap className="h-6 w-6 text-blue-500" />
                    ) : sub.name.toLowerCase() === "pro" ? (
                      <Stethoscope className="h-6 w-6 text-blue-500" />
                    ) : (
                      <Award className="h-6 w-6 text-blue-500" />
                    )}
                    {sub.name} Plan
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    {sub.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 text-4xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                    {sub.price === 0 ? "Free" : `$${sub.price}`}{" "}
                    {sub.price > 0 && (
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        USD/month
                      </span>
                    )}
                    {sub.daysFree > 0 && (
                      <div className="text-sm font-normal text-green-500">
                        {sub.daysFree} days free access
                      </div>
                    )}
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        Upload up to {sub.maxQuestions === "Unlimited" ? "unlimited" : sub.maxQuestions} questions per day
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        Use AI chat up to {sub.maxChats} times per day
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        Use agent up to {sub.maxAgents} times per day
                      </span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button
                    className={`w-full h-11 transition-all duration-300 ${sub.name.toLowerCase() === "pro"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 bg-transparent border"
                      }`}
                    onClick={() => handleNavigation("/register")}
                  >
                    {sub.price === 0 ? "Get Started" : "Select"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-medium mb-4 transition-colors duration-300">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              Answers to Your Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              Everything you need to know about our medical learning platform.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto grid gap-6">
            <motion.div
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                How are the questions organized?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Questions are categorized into Basic Sciences (Anatomy, Physiology, Biochemistry), Organ Systems (Cardiovascular, Respiratory, etc.) and Clinical Specialties (Internal Medicine, Surgery, Pediatrics).
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                Can I filter questions by difficulty?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Yes, you can filter by status (Correct, Incorrect, Not attempted, Marked) and by difficulty level to customize your study experience.
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                Is there limits to how much I can upload?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                yes limits will be applied if you exceed your daily usage
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                How does progress tracking work?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Our analytics system provides detailed reports of your performance by specialty, but it is not a replacement for real evaluation exams.
              </p>
            </motion.div>
            <motion.div
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                Is there limits to how much I can upload?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                yes limits will be applied if you exceed your daily usage, but you can manually add any questions, explanations and attach files
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-b from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 text-white transition-all duration-300"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Mastering Medicine Today</h2>
            <p className="text-blue-200 text-lg mb-8">
              Free, no commitments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 font-medium transition-all duration-300"
                onClick={() => handleNavigation("/register")}
              >
                Start Free
              </Button>
              <Button
                variant="default"
                className="bg-white text-blue-700 px-8 py-6 text-base font-medium hover:bg-blue-100 transition-all duration-300"
                onClick={() => window.open("mailto:support@synapaxon.com", "_blank")}
              >
                Contact Support
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <a href="/" className="flex items-center space-x-2 gap-2 font-semibold text-xl text-white mb-4">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                Synapaxon
              </a>
              <p className="mb-4">
                Medical learning platform for students, residents and healthcare professionals.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Specialties
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Medical Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Study Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Clinical Cases
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Universities
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© 2024 Synapaxon. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}