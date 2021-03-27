import React from 'react';
import {Nav} from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import {LinkContainer} from "react-router-bootstrap"

const CheckoutSteps = ({step1, step2, step3, step4}) => {

    let percentage = 0
    if (step1) {
        percentage = 25
    }
    if (step2) {
        percentage = 50
    }
    if (step3) {
        percentage = 75
    }
    if (step4) {
        percentage = 100
    }

    return (
        <>
            <ProgressBar completed={percentage} />
        <Nav>
            <Nav.Item>
                {step1 ? (
                    <LinkContainer to='/login'>
                        <Nav.Link>
                            Sign In
                        </Nav.Link>
                    </LinkContainer>) : (
                    <Nav.Link disabled style={{color:'white'}}>Sign In</Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step2 ? (
                    <LinkContainer to='/shipping'>
                        <Nav.Link>
                            Shipping
                        </Nav.Link>
                    </LinkContainer>) : (
                    <Nav.Link disabled style={{color:'white'}}>Shipping</Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step3 ? (
                    <LinkContainer to='/payment'>
                        <Nav.Link>
                            Payment
                        </Nav.Link>
                    </LinkContainer>) : (
                    <Nav.Link disabled style={{color:'white'}}>Payment</Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step4 ? (
                    <LinkContainer to='/placeorder'>
                        <Nav.Link>
                            Place Order
                        </Nav.Link>
                    </LinkContainer>) : (
                    <Nav.Link disabled style={{color:'white'}}>Place Order</Nav.Link>
                )}
            </Nav.Item>
        </Nav>
        </>
    );
}

export default CheckoutSteps;
