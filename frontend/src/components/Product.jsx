import React from 'react'
import {Card} from "react-bootstrap"
import Rating from '../components/Rating'
import {Link} from "react-router-dom"
import {addToWishList, removeFromWishList} from "../actions/wishListActions";
import {useDispatch} from 'react-redux'

const Product = ({product, checkWishlist}) => {


    const dispatch = useDispatch()

    const addToWishListHandler = (productId) => {
        if (checkWishlist) {
            dispatch(removeFromWishList (productId))
        }
        else {
            dispatch(addToWishList(productId, 1))
        }
    }

    return (
        <Card className='my-3 p-3 rounded product-card'>
            <Link to={`/product/${product._id}`}>
                <Card.Img className='product-img' src={product.image} variant='top'/>
            </Link>
            <div className='header__cart__icon__product' onClick={() => addToWishListHandler(product._id)}>
                {checkWishlist ?  <i className='fas fa-heart' style={{color:'#712b29'}}/> : <i className='fas fa-heart'/>  }
            </div>
            <Card.Body>
                <Link to={`/product/${product._id}`}>
                    <Card.Title as='div'>
                        <strong className='product-name'>
                            {product.name}
                        </strong>
                    </Card.Title>
                </Link>
                <Card.Text as='div'>
                  <Rating value={product.rating}
                          text={`${product.numReviews} reviews`}
                  />
                </Card.Text>
                <Card.Text as='h3'>${product.price} </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default Product;
