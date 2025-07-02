import { loadStripe } from "@stripe/stripe-js";

export const useStripe = () => {
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PLUBLIC_KEY || "");

    /**
     * @description Realiza el pago de la session creada
     * @param sessionId ID de la sesión de pago o suscripción
     */
    async function handlePago(sessionId:string) {
        const stripe = await stripePromise;
        const { error }:any = await stripe?.redirectToCheckout({
            sessionId: sessionId, // ID de la sesión de pago o suscripción
        });

        if (error) {
            console.error("Error al redirigir al Checkout de Stripe:", error);
        }
    }

    return {handlePago}
}