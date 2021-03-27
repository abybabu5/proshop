import React from 'react';
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js/pure";
import PaymentForm from "./PaymentForm";

const PUBLIC_KEY = "pk_test_51I3kunFu9JpJ9qGKbRJvBd6hHiQ7HuTTBvDZ1QTa8ag9HAMt2SICmqF5cFaqnP0BVk5TDzhQlPVFwtkmisqWBzlB00Z5fW8Nnk"
const StripeContainer = () => {
    const stripeTestPromise = loadStripe(PUBLIC_KEY)
        return (
            <Elements stripe={stripeTestPromise}>
             <PaymentForm/>
            </Elements>
        );
}

export default StripeContainer;