import React, {useEffect} from 'react'
import {Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import {listProducts} from '../actions/productActions'
import {addToWishList} from '../actions/wishListActions'
import Product from "../components/Product"
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from '../components/Meta'
import Message from "../components/Message";
import {Link} from "react-router-dom";

const HomeScreen = ({match, history, location}) => {
    const keyword = match.params.keyword
    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch()
    const productList = useSelector(state => state.productList)
    const {loading, error, products, page, pages} = productList
    const productId = match.params.id
    const qty = location.search ? Number(location.search.split('=')[1]) : 1

    const wishlistStore = useSelector(state => state.productWishList)
    const {wishlist} = wishlistStore;

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber))
    }, [dispatch, keyword, pageNumber])

    const addToWishListHandler = (id) => {
        history.push(`/wishlist/${id}`)
        dispatch(addToWishList(productId, qty))
    }

    const checkWishList = (productId) => {
        if (productId) {
           return wishlist.find((item) => {
                return item.product === productId
            })
        }
    }

    return (
        <>
       <Meta/>
            {!keyword ? <ProductCarousel/> : <Link to='/' className='btn btn-light'>Go Back</Link>}
            <h1>Latest Products</h1>
            {loading ? (
                <Loader/>
            ) : error ? (
                <Message variant='danger'>
                    {error}
                </Message>
            ) : (
                <>
                    <Row>
                        {products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} addToWishList={addToWishListHandler} checkWishlist={checkWishList(product._id)}/>
                            </Col>
                        ))}
                    </Row>
                    <Row>
                        <Col sm={12} md={6} lg={4} xl={3}>
                            <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''}/>
                        </Col>
                    </Row>
                </>
            )}
        </>
    )
}

export default HomeScreen;
