import React, {useEffect, useState} from "react";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {Button, Form} from "react-bootstrap";
import {resetCart, savePaymentMethod} from "../actions/cartActions";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {payOrder} from "../actions/orderActions";

const PaymentForm = ({ history }) => {

    const [success, setSuccess] = useState(false)
    const [setProcessing] = useState("");

    const stripe = useStripe()
    const elements = useElements()
    const dispatch = useDispatch()

    const orderDetails = useSelector((state) => state.orderDetails)
    const {order} = orderDetails

    const [clientSecret, setClientSecret] = useState(true);
    useEffect(() => {
        // it generates the special stripe secret which will allow us to charge a user
        const getClientSecret = async () => {
            const response = await axios.post(`/api/payments/create`,
                {totalPrice: order.totalPrice*1000});
            setClientSecret(response.data.clientSecret)
        }
        getClientSecret();
    }, [order]);

    const CARD_OPTIONS = {
        iconStyle: "solid",
        style: {
            base: {
                iconColor: "#0b87ac",
                color: "#000000",
                fontWeight: 500,
                fontFamily: "Roboto, Open Sans, Segue UI, sans-serif",
                fontSize: "16px",
                fontSmoothing: "antialiased",
                ":-webkit-autofill": {color: ''},
                "::placeHolder": {color: '#87bbfd'}
            },
            invalid: {
                iconColor: "#ffc7ee",
                color: "#ffc7ee"
            }

        }
    }

    const handleSubmit = async (e) => {
        //stripe
        e.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({paymentIntent}) => {
            console.log(paymentIntent)
            const createPaymentStripe = {
                id: paymentIntent.id,
                status: paymentIntent.status,
                update_time: paymentIntent.created,
                payer: {email_address: 'stripe@stripe.com'}

            }
            dispatch(payOrder(order._id, createPaymentStripe))
            dispatch(resetCart())
            setSuccess(true);
            setProcessing(false);

        })
        if (success) {
            console.log("*****", order._id)
            history.push(`/order/${order._id}`)
        }
    }

    return (
        <>
            {!success ? <Form onSubmit={handleSubmit}>
                    <fieldset className='FormGroup'>
                        <div className="FormRow">
                            <CardElement options={CARD_OPTIONS}/>
                        </div>
                    </fieldset>
                    <button className='stripe__pay__button'>Pay</button>
                </Form>
                :
                <div>
                    <h2>You just ordered from Aby's ProShop, congrats this is the best decision of your life</h2>
                </div>}
        </>
    )
}
export default PaymentForm;








