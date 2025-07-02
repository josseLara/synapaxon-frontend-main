"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GraduationCap, Stethoscope, Award, Check, X, Loader2 } from "lucide-react"
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Header from "../../components/header"
import { loadStripe } from '@stripe/stripe-js'
import axios from '../../api/axiosConfig'
import { useStripe } from "../../hook/useStripe"
import { toast } from 'react-toastify' // Optional for notifications

const subscriptionsData = [
  {
    id: 'free',
    name: "Free",
    description: "Ideal for students just starting out",
    price: 0,
    features: ["Basic access", "Email support"]
  },
  {
    id: 'pro',
    name: "Pro",
    description: "For serious students who need more resources",
    price: 9.99,
    features: ["Priority access", "24/7 support", "Advanced statistics"]
  },
  {
    id: 'premium',
    name: "Premium",
    description: "For professionals who need maximum performance",
    price: 19.99,
    features: ["Unlimited access", "Priority support", "Complete analytics"]
  }
]

export default function SubscriptionPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isSwitchingToFree, setIsSwitchingToFree] = useState(false)
  const { handlePago } = useStripe()

  // Get user's current plan
  useEffect(() => {
    const fetchUserSubscription = async () => {
      try {
        const response = await axios.get('/api/subscriptions/me')
        setCurrentPlan(response.data.subscription?.plan || 'free')
      } catch (error) {
        console.error("Error fetching subscription:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserSubscription()
  }, [])

  const handleSelectPlan = async (planId) => {
    if (planId === 'free') {
      setIsSwitchingToFree(true)
      try {
        // Use new endpoint to switch to free
        await axios.post('/api/subscriptions/switch-to-free')
        setCurrentPlan('free')
        toast.success('You have successfully switched to the Free plan')
        navigate('/dashboard')
      } catch (error) {
        console.error("Error switching to free plan:", error)
        toast.error('Error switching to Free plan')
      } finally {
        setIsSwitchingToFree(false)
      }
    } else {
      try {
        setLoading(true)
        // Create checkout session in backend
        const response = await axios.post('/api/subscriptions/checkout', { planId })
        const { sessionId } = response.data
        // Redirect to Stripe Checkout
        handlePago(sessionId)
      } catch (error) {
        console.error('Error creating subscription:', error)
        toast.error('Error processing subscription')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancelSubscription = async () => {
    setIsCancelling(true)
    try {
      await axios.delete('/api/subscriptions')
      setCurrentPlan('free')
      toast.success('Subscription cancelled, you now have the Free plan')
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      toast.error('Error cancelling subscription')
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Choose your subscription plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Unlock the full potential of our platform with a plan that fits your needs.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {subscriptionsData.map((sub) => (
                <motion.div
                  key={sub.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className={`relative flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border ${
                    sub.id === "pro"
                      ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900 shadow-lg shadow-blue-500/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                  }`}
                >
                  {sub.id === "pro" && (
                    <div className="absolute -right-1 -top-1 rounded-bl-md rounded-tr-md bg-blue-500 px-3 py-1 text-xs font-medium text-white shadow-md">
                      Recommended
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {sub.id === "free" ? (
                        <GraduationCap className="h-8 w-8 text-blue-500" />
                      ) : sub.id === "pro" ? (
                        <Stethoscope className="h-8 w-8 text-blue-500" />
                      ) : (
                        <Award className="h-8 w-8 text-blue-500" />
                      )}
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {sub.name}
                      </h3>
                    </div>
                    
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      {sub.description}
                    </p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-800 dark:text-white">
                        {sub.price === 0 ? "Free" : `$${sub.price}`}
                      </span>
                      {sub.price > 0 && (
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                          /month
                        </span>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {sub.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="px-6 pb-6">
                    <button
                      onClick={() => handleSelectPlan(sub.id)}
                      disabled={currentPlan === sub.id || loading || (sub.id === 'free' && isSwitchingToFree)}
                      className={`w-full py-3 px-4 rounded-lg transition-all duration-300 ${
                        sub.id === "pro"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 bg-transparent"
                      } ${
                        currentPlan === sub.id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {currentPlan === sub.id
                        ? "Your Current Plan"
                        : sub.price === 0
                        ? isSwitchingToFree ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Select Free"
                        : "Subscribe"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {currentPlan && currentPlan !== 'free' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="max-w-2xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-red-200 dark:border-red-800/50"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Your Current Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                    </h3>
                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                      Active
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    You are currently subscribed to the {currentPlan} plan. You can cancel your subscription at any time.
                  </p>
                  <button
                    onClick={()=>handleSelectPlan('free')}
                    disabled={isCancelling}
                    className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                  >
                    {isCancelling ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        Cancel Subscription
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  )
}