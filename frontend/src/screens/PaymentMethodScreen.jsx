import React, {useState} from 'react';
import FormContainer from "../components/FormContainer";
import {Button, Form, Col} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/ChecoutSteps";

const PaymentMethodScreen = ({history}) => {
    const cart = useSelector(state => state.cart)
    const {shippingAddress} = cart

    if (!shippingAddress) {
        history.push('/shipping')
    }
    const [paymentMethod, setPaymentMethod] = useState('PayPal')


    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }
    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3/>
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>
                        Select Method
                    </Form.Label>
                <Col>
                    <Form.Check
                        type='radio'
                        label='Credit/ Debit Card'
                        id='Stripe'
                        name='paymentMethod'
                        value='Stripe'
                        onClick={(e) => setPaymentMethod(e.target.value)}>
                    </Form.Check>
                    <Form.Check
                        type='radio'
                        label='PayPal'
                        id='PayPal'
                        name='paymentMethod'
                        value='PayPal'
                        defaultChecked={true}
                        onClick={(e) => setPaymentMethod(e.target.value)}>
                    </Form.Check>
                </Col>
                </Form.Group>
                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    );
}

export default PaymentMethodScreen;

