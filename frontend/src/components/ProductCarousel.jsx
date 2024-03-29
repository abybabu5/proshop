import React, {useEffect} from 'react';
import {Link} from 'react-router-dom'
import {Carousel, Image} from "react-bootstrap";
import Loader from "../loaders/Loader";
import Message from "./Message";
import {listTopProducts} from "../actions/productActions";
import {useDispatch, useSelector} from "react-redux";

const ProductCarousel = () => {
    const dispatch = useDispatch()

    const productTopRated = useSelector(state => state.productTopRated)
    const {loading, error, products} = productTopRated

    useEffect(() => {
        dispatch(listTopProducts())
    }, [dispatch])

    return loading ? <Loader/> : error ? <Message variant='danger'>{error}</
        Message> : (
        <Carousel pause='hover' className='bg-transparent' style={{borderRadius:'35px'}}>
            {products.map(product => (
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <div className='carousel__image' style={{display:'flex', margin:'50px'}}><Image style={{margin:'auto'}} src={product.image} alt={product.name} fluid/></div>
                        <Carousel.Caption className='carousel-caption'>
                            <h2>{product.name}(${product.price})</h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>)
}
export default ProductCarousel;
