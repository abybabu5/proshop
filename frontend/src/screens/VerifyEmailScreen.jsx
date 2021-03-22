import React from 'react';
import {Modal} from "react-bootstrap";

const VerifyEmailScreen = () => {

    return (
        <><div style={{height:'100vh'}}>
            <Modal show={true} className="d-flex pt-5 justify-content-center">
                <Modal.Title className='text-center'>PROSHOP</Modal.Title>
                <Modal.Body>Welcome to Aby's Proshop. We have sent you an email with the link. Please click the link to verify and activate your account.</Modal.Body>
            </Modal>
        </div>
        </>
    );
}

export default VerifyEmailScreen;
