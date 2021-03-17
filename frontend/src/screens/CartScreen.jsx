import React, {useEffect, forwardRef} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {Button, Card, Col, Image, ListGroup, Row, Form} from 'react-bootstrap'
import {addToCart, removeFromCart } from '../actions/cartActions'
import FlipMove from 'react-flip-move';
import Message from '../components/Message'
import Product from "../components/Product";

const CartScreen = ({match, location, history}) => {
    const productId = match.params.id

    const qty = location.search ? Number(location.search.split('=')[1]) : 1
    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const {cartItems} = cart

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeFromCartHandler = (id) => {
        //console.log('remove')
        dispatch (removeFromCart(id))
    }
    const checkoutHandler = () => {
       // console.log('checkout')
        history.push('/login?redirect=shipping')
    }
    forwardRef((item, ref) => (
        <div ref={ref}>
            <Product
                key={item.cartId}
                id={item.id}
                title={item.name}
                image={item.image}
                price={item.price}
                rating={item.rating}
                {...item}/>

        </div>
    ));

    return (
        <>    <Link to='/' className='btn btn-light my-3' style={{textUnderline:'none'}}>
        Go back
            </Link>
        <Row>
        <Col md={8}>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ?
                (<Message>
                        Your cart is empty <Link to="/">Go back</Link>
                    </Message>
                ) : (
                    <ListGroup variant='flush'>
                        <FlipMove>
                        {cartItems.map(item => (
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded/>
                                    </Col>
                                    <Col md={3} className='m-auto'> <Link to={`/product/${item.product}`}>{item.name}</Link></Col>
                                    <Col md={2} className='m-auto'>${item.price}</Col>
                                    <Col md={2} className='m-auto'>
                                        <Form.Control as='select' value={item.qty} onChange={(e) =>
                                            dispatch(addToCart(item.product, Number(e.target.value)))}>
                                            {[...Array(item.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={2} className='m-auto'>
                                        <Button
                                            type='button'
                                            variant='light'
                                            onClick={() => removeFromCartHandler(item.product)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                        </FlipMove>
                    </ListGroup>
                )}
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Subtotal({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                        ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
                        .toFixed(2)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Button type='button' className='btn-block' disabled={cartItems.length === 0}
                                onClick={checkoutHandler}>
                            Proceed to checkout
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>

        <Col md={2}>

        </Col>
    </Row>
            </>)
}

export default CartScreen;
