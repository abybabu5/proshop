import React from 'react'
import {Card} from "react-bootstrap"
import Rating from '../components/Rating'
import {Link} from "react-router-dom"
import Favorites from "./Favorites";

const Product = ({product}) => {
    return (
        <Card className='my-3 p-3 rounded product-card'>
            <Link to={`/product/${product._id}`}>
                <Card.Img className='product-img' src={product.image} variant='top'/>
            </Link>
            <Favorites product={product}/>
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
