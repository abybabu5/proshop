import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Loader from "../loaders/Loader";
import {Button, Card, Col, Image, ListGroup, Row} from "react-bootstrap";
import Message from "../components/Message";
import {Link} from "react-router-dom";
import {getOrderDetails, payOrder, deliverOrder} from '../actions/orderActions'
import axios from "axios";
import {PayPalButton} from "react-paypal-button-v2";
import {ORDER_PAY_RESET, ORDER_DELIVER_RESET, ORDER_CREATE_RESET} from "../constants/orderConstants";
import {resetCart, savePaymentMethod} from '../actions/cartActions';
import LoaderPayment from "../loaders/LoaderPayment";
import StripeContainer from "../components/StripeContainer";



const OrderScreen = ({match, history}) => {
    const orderId = match.params.id

    const [sdkReady, setSdkReady] = useState(false)
    const [showItem, setShowItem] = useState(false)

    const dispatch = useDispatch()

    const orderDetails = useSelector((state) => state.orderDetails)
    const {order, loading, error} = orderDetails

    const orderPay = useSelector((state) => state.orderPay)
    const {loading: loadingPay, success: successPay} = orderPay

    const orderDeliver = useSelector((state) => state.orderDeliver)
    const {loading: loadingDeliver, success: successDeliver} = orderDeliver

    const userLogin = useSelector((state) => state.userLogin)
    const {userInfo} = userLogin

    if (!loading) {
        //Calculate price
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }

        order.itemsPrice = addDecimals(
            order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
        )

    }


    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        }
        if (order && orderId !== order._id) {
            dispatch(getOrderDetails(orderId))
        }
        const addPayPalScript = async () => {
            const {data: clientId} = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }
        if (!order || successPay || successDeliver) {
            dispatch({type: ORDER_PAY_RESET})
            dispatch({type: ORDER_DELIVER_RESET})
            dispatch({type: ORDER_CREATE_RESET})
            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
            }
        } else {
            setSdkReady(true)
        }
    }, [dispatch, orderId, successPay, successDeliver, order, history, userInfo])


    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
        dispatch(resetCart())
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }
    return loading ? <LoaderPayment/> : error ? <Message variant='danger'>{error}</Message> : <>
        <h1>Order {order._id}</h1>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p><strong>Name: </strong> {order.user.name} {order.user.surname}</p>
                        <p><strong>Email: </strong><a href={`mailto:${order.user.email}`
                        }>{order.user.email}</a></p>
                        <p>
                            <strong>Address: </strong>
                            <span>{order.shippingAddress.address}</span>
                            <span>{order.shippingAddress.city},</span>
                            <span>{order.shippingAddress.postalCode},</span>
                            <span>{order.shippingAddress.country}</span>
                        </p>
                        {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                            : <Message variant='danger'>Not Delivered</Message>}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message>
                            : <Message variant='danger'>Not Paid</Message>}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? <Message>Order is empty</Message> : (
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded/>
                                            </Col>
                                            <Col>
                                                <Link to={
                                                    `/product/${item.product}`
                                                }>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x $
                                                {
                                                    item.price
                                                }
                                                = $
                                                {
                                                    item.qty * item.price
                                                }

                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>${order.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        {!order.isPaid && order.paymentMethod === 'PayPal' && (
                             <ListGroup.Item>
                                {loadingPay && <Loader/>}
                                {!sdkReady ? <Loader/> : (
                                    <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler}/>)}

                            </ListGroup.Item>
                        )}
                        {!order.isPaid && order.paymentMethod === 'Stripe' && <ListGroup.Item>
                            <StripeContainer />
                            </ListGroup.Item>}
                        {loadingDeliver && <Loader/>}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                    Mark As Delivered
                                </Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            </Col>
        </Row></>

}

export default OrderScreen;
