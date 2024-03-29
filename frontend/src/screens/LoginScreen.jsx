import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Message from "../components/Message";
import Loader from "../loaders/Loader";
import {login} from "../actions/userActions";
import FormContainer from "../components/FormContainer";
import {Button, Col, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import SweetAlert from 'sweetalert2-react';

const LoginScreen = ({location, history}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)


    const dispatch = useDispatch()

    const userLogin = useSelector((state => state.userLogin))
    const {loading, error, userInfo} = userLogin

    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {
        if (userInfo && userInfo.name) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
        setShow(true);
    }
    return (
        <FormContainer>
            <h1>Sign In</h1>
            {error && <div> <SweetAlert
                error
                show={show}
                title="PROSHOP 'Error'"
                text={error}
                dangerMode={true} onConfirm={() => setShow(false)}/> <Message variant='danger'>{error}</Message></div>}
            {loading && <Loader/>}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeHolder='Enter mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>password</Form.Label>
                    <Form.Control
                        type='password'
                        placeHolder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button type='submit' variant='primary'>
                    Sign In
                </Button>
            </Form>
            <Row className='py-3'>
                <Col>
                    New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
                </Col>
            </Row>
        </FormContainer>
    );
}

export default LoginScreen;
