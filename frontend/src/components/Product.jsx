import React from 'react';
import {Card} from "react-bootstrap";
import Rating from '../components/Rating'

const Product = ({product}) => {
    return (
        <Card className='my-3 p-3 rounded product-card'>
            <a href={`/product/${product._id}`}>
                <Card.Img className='product-img' src={product.image} variant='top'/>
            </a>
            <Card.Body>
                <a href={`/product/${product._id}`}>
                    <Card.Title as='div'>
                        <strong className='product-name'>
                            {product.name}
                        </strong>
                    </Card.Title>
                </a>
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
