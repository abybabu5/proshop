import React, {useState} from 'react'
import {Button} from "@material-ui/core";
import {Form} from "react-bootstrap";

const SearchBox = ({ history }) => {
    const [keyword, setKeyword] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()
        if(keyword.trim()){
            history.push(`/search/${keyword}`)
        } else {
            history.push('/')
        }
    }

    return (
        <Form onSubmit={submitHandler} inline>
            <Form.Control type='text' name='q' onChange={(e) => setKeyword(e.target.value)}
                          placeorder='Search Products...' className='mr-sm-2 ml-sm-5 input__filed'>

            </Form.Control>
            <Button type='submit' variant='contained' className='p-2'>
                Search
            </Button>
        </Form>
    );

}
export default SearchBox
