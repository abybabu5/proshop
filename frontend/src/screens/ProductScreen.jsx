import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom"
import {useDispatch, useSelector} from 'react-redux'
import {Button, Card, Col, Image, ListGroup, Row, Form} from "react-bootstrap"
import {listProductDetails, createProductReview, productReviewDelete} from '../actions/productActions'
import Rating from '../components/Rating'
import Loader from "../loaders/Loader";
import Message from "../components/Message";
import Meta from '../components/Meta'
import {PRODUCT_CREATE_REVIEW_RESET, PRODUCT_REVIEW_DELETE_SUCCESS} from "../constants/productConstants"
import {addToWishList, removeFromWishList} from "../actions/wishListActions";



const ProductScreen = ({history, match}) => {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()

    const productDetails = useSelector((state) => state.productDetails)
    const {loading, error, product} = productDetails

    const userLogin = useSelector((state) => state.userLogin)
    const {userInfo} = userLogin

    const productReviewCreate = useSelector((state) => state.productReviewCreate)
    const {success: successProductReview, error: errorProductReview} = productReviewCreate

    const wishlistStore = useSelector(state => state.productWishList)
    const {wishlist} = wishlistStore;

    useEffect(() => {
        if (successProductReview) {
            alert('Review Submitted')
            setRating(0)
            setComment('')
            dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
        }

        setTimeout(() => window.scrollTo({top: 0, behavior: "smooth"}),
            dispatch(listProductDetails(match.params.id)), 100);
    }, [dispatch, match, successProductReview])


    useEffect(() => {
        console.log(productDetails)
        if (productDetails.product.reviews && userInfo && userInfo._id) {
            const myReview = productDetails.product.reviews.find((r) => r.user && userInfo._id === r.user._id);
            if (myReview) {
                setRating(myReview.rating);
                setComment(myReview.comment);
            }
        }
    }, [productDetails, userInfo]);

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(match.params.id, {rating, comment}))
    }
    const reviewEditHandler = () => {

    }
    const reviewDeleteHandler = (e) => {
        dispatch(productReviewDelete(match.params.id))
    }

    const checkWishList = () => {
        return wishlist.find((item) => {
            return item.product === match.params.id
        })
    }


    const addToWishListHandler = () => {
        if (isInWishlist) {
            dispatch(removeFromWishList(match.params.id))
        } else {
            dispatch(addToWishList(match.params.id, 1))
        }
    }

    const isInWishlist = checkWishList(match.params.id)
    return (
        <>
            <Link className='btn btn-light my-3' to='/'>
                Go back
            </Link>
            {loading ? <Loader/>
                : error ?
                    <Message variant='danger'>
                        {error}
                    </Message> : (
                        <>
                            <Meta title={product.name}/>
                            <Row>
                                <Col md={6}>
                                    <div className='header__cart__icon__product mx-3'
                                         onClick={() => addToWishListHandler(product._id)}>
                                        {isInWishlist ? <i className='fas fa-heart' style={{color: '#712b29'}}/> :
                                            <i className='fas fa-heart'/>}
                                    </div>
                                    <Image src={product.image} alt={product.name} fluid/>
                                </Col>
                                <Col md={3}>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <h3>{product.name}</h3>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Rating value={product.rating} text={product.numReviews} reviews/>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            Price: ${product.price}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            Description: {product.description}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                                <Col md={3}>
                                    <Card>
                                        <ListGroup variant='flush'>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        Price:
                                                    </Col>
                                                    <Col>
                                                        <strong>${product.price}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>
                                                        Status:
                                                    </Col>
                                                    <Col>
                                                        <strong>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</strong>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            {product.countInStock > 0 && (
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Qty</Col>
                                                        <Col>
                                                            <Form.Control as='select' value={qty} onChange={(e) =>
                                                                setQty(e.target.value)}>
                                                                {[...Array(product.countInStock).keys()].map((x) => (
                                                                    <option key={x + 1} value={x + 1}>
                                                                        {x + 1}
                                                                    </option>
                                                                ))}
                                                            </Form.Control>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )}
                                            <ListGroup.Item>
                                                <Button
                                                    onClick={addToCartHandler}
                                                    className='btn-block' type='button'
                                                    disabled={product.countInStock === 0}>
                                                    Add To Cart
                                                </Button>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <h2>Reviews</h2>
                                    {product.reviews.length === 0 && <Message>No Reviews</Message>}
                                    <ListGroup variant='flush'>
                                        {product.reviews.map(review => review.user !== null ? (
                                            <ListGroup.Item key={review._id}>
                                                <div style={{display:'flex', flexDirection:'row', justifyContent: "space-between"}} >
                                                    <div>
                                                        <strong>{review.user.name} {review.user.surname}</strong>
                                                        <Rating value={review.rating}/>
                                                        <p>{review.createdAt.substring(0, 10)}</p>
                                                        <p>{review.comment}</p></div>
                                                    {review.user && userInfo._id === review.user._id && <div>
                                                        <span style={{margin:'5px', cursor:'pointer'}} onClick={reviewEditHandler}><i className='fas fa-edit '/></span>
                                                        <span style={{margin:'5px', cursor:'pointer'}} onClick={reviewDeleteHandler}><i className='fas fa-trash'/></span>
                                                    </div>}
                                                </div>
                                            </ListGroup.Item>
                                            ):null)}
                                        <ListGroup.Item>
                                            <h2>Write a customer review</h2>
                                            {errorProductReview &&
                                            <Message variant='danger'>{errorProductReview}</Message>}
                                            {userInfo ? (<Form onSubmit={submitHandler}>
                                                <Form.Group controlId='rating'>
                                                    <Form.Label>Rating</Form.Label>
                                                    <Form.Control as='select' value={rating}
                                                                  onChange={(e) => setRating(e.target.value)}>
                                                        <option value="">Select...</option>
                                                        <option value="1">1 - Poor</option>
                                                        <option value="2">2 - Fair</option>
                                                        <option value="3">3 - Good</option>
                                                        <option value="4">4 - Very Good</option>
                                                        <option value="5">5 - Excellent</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group controlId='comment'>
                                                    <Form.Label>Comment</Form.Label>
                                                    <Form.Control as='textarea' row='3' value={comment}
                                                                  onChange={(e) => setComment(e.target.value)}
                                                    />
                                                </Form.Group>
                                                <Button type='submit' variant='primary'>
                                                    Submit
                                                </Button>
                                            </Form>) : <Message>Please <Link to='/login'>sign in</Link> to write a
                                                review</Message>}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </>
                    )}
        </>
    )
}


export default ProductScreen;
