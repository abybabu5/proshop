import React from 'react';
import {Modal} from "react-bootstrap";

const VerifyEmailScreen = () => {

    return (
        <>
            <Modal show={true} className="d-flex align-items-center justify-content-center" >
                <Modal.Title className='text-center'>PROSHOP</Modal.Title>
                <Modal.Body>Welcome to Aby's Proshop. We have sent you an email with the link. Please verify the link and activate your account.</Modal.Body>
            </Modal>
        </>
    );
}

export default VerifyEmailScreen;
