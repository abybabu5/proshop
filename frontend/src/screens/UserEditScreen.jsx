import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Message from "../components/Message";
import Loader from "../loaders/Loader";
import {getUserDetails, updateUser} from "../actions/userActions";
import {USER_UPDATE_RESET} from "../constants/userConstants";
import FormContainer from "../components/FormContainer";
import {Button, Form} from "react-bootstrap";
import {Link} from "react-router-dom";

const UserEditScreen = ({ match, history }) => {
    const userId = match.params.id

    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState('false')


    const dispatch = useDispatch()

    const userDetails = useSelector((state => state.userDetails))
    const {loading, error, user} = userDetails

    const userUpdate = useSelector((state => state.userUpdate))
    const {loading: loadingUpdate, error: errorUpdate, success: successUpdate} = userUpdate

    useEffect(() => {
        if (successUpdate) {
            dispatch({type: USER_UPDATE_RESET})
            history.push('/admin/userlist')
        } else {
            if (!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name)
                setSurname(user.surname)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }
    }, [dispatch, history, userId, user, successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({_id: userId, name, surname, email, isAdmin}))
    }
    return (
        <>
            <Link to='/admin/userlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader/>}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> :
                    (<Form onSubmit={submitHandler}>
                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type='name'
                                    placeHolder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                        <Form.Group controlId='surname'>
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                                type='surname'
                                placeHolder='Enter surname'
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                            />
                        </Form.Group>
                            <Form.Group controlId='email'>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeHolder='Enter mail'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId='isAdmin'>
                                <Form.Check
                                    type='checkbox'
                                    label='Is Admin'
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                               />
                            </Form.Group>
                            <span>
                            <Button type='submit' variant='primary'>
                                Update
                            </Button>
                                </span>
                        </Form>
                    )}

            </FormContainer>
        </>

    )
        ;
}

export default UserEditScreen;
