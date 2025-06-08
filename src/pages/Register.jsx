"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EyeIcon, EyeOffIcon, ArrowLeftIcon, CheckIcon, UserIcon, MailIcon, LockIcon, Stethoscope } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  function validate() {
    const errors = {}
    if (!name.trim()) errors.name = "Name is required"
    else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters"

    if (!email) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is not valid"

    if (!password) errors.password = "Password is required"
    else if (password.length < 6) errors.password = "Password must be at least 6 characters"

    if (!confirmPassword) errors.confirmPassword = "Please confirm your password"
    else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match"

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!validate()) return

    setError("")
    setLoading(true)

    try {
      await register(name, email, password)
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Error creating account")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleRegister() {
    setLoading(true)
    setError("")
    try {
      // Simulate Google registration
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      setError("Error registering with Google")
      setLoading(false)
    }
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <motion.div
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckIcon className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h2
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Account created successfully!
          </motion.h2>
          <motion.p
            className="text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Redirecting to login...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 px-4 py-8">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Synapaxon</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
          <p className="text-gray-600 dark:text-gray-300">Join the medical community</p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-6 px-6 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    validationErrors.name
                      ? "border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600"
                  } dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                  placeholder="Dr. John Smith"
                />
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <AnimatePresence>
                {validationErrors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-1 text-xs text-red-600 dark:text-red-400"
                  >
                    {validationErrors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    validationErrors.email
                      ? "border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600"
                  } dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                  placeholder="doctor@hospital.com"
                />
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <AnimatePresence>
                {validationErrors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-1 text-xs text-red-600 dark:text-red-400"
                  >
                    {validationErrors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    validationErrors.password
                      ? "border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600"
                  } dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                  placeholder="Minimum 6 characters"
                />
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              <AnimatePresence>
                {validationErrors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-1 text-xs text-red-600 dark:text-red-400"
                  >
                    {validationErrors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    validationErrors.confirmPassword
                      ? "border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600"
                  } dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                  placeholder="Repeat your password"
                />
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              <AnimatePresence>
                {validationErrors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-1 text-xs text-red-600 dark:text-red-400"
                  >
                    {validationErrors.confirmPassword}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-start pt-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                required
              />
              <label htmlFor="terms" className="ml-2 text-xs text-gray-600 dark:text-gray-300">
                I accept the{" "}
                <a href="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
                  terms and conditions
                </a>{" "}
                and the{" "}
                <a href="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
                  privacy policy
                </a>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-700 text-white border-white hover:bg-blue-600 font-semibold rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-6"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>

            <motion.button
              onClick={handleGoogleRegister}
              disabled={loading}
              className="mt-3 w-full py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              <span>Sign up with Google</span>
            </motion.button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <button
                onClick={() => handleNavigation("/login")}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Log in
              </button>
            </p>
          </div>
        </div>

        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => handleNavigation("/")}
            className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium text-sm"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Register