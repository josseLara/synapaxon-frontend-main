"use client"

import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '../../components/ui/button'
import { Loader2, CheckCircle } from 'lucide-react'

export default function StripePaymentForm({ planId, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Crear método de pago
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      })

      if (stripeError) {
        throw stripeError
      }

      // 2. Llamar al backend para crear la suscripción
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId,
          paymentMethodId: paymentMethod.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed')
      }

      // 3. Confirmar el pago
      const { error: confirmError } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: paymentMethod.id
        }
      )

      if (confirmError) {
        throw confirmError
      }

      setSuccess(true)
      setTimeout(() => onSuccess(), 1500)
    } catch (err) {
      setError(err.message)
      onError(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center p-4">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
        <p className="text-gray-600 dark:text-gray-300">Your subscription is now active.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-4 dark:border-gray-600">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm dark:text-red-400">
          {error}
        </div>
      )}
      
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        {loading ? 'Processing...' : `Subscribe Now`}
      </Button>
    </form>
  )
}