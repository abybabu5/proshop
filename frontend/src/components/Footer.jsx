import React from 'react';
import {Container, Row, Col} from 'react-bootstrap'
import MainFooter from "./mainFooter/MainFooter";

const Footer = (props) => {
    return (
        <>
        <MainFooter/>
        <div className='container-fluid'>
            <Row>
                <Col className="text-center" py-3>
                    Copyright &copy; ProShop 2021
                </Col>
            </Row>
        </div>
        </>

    );
}

export default Footer;
