import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import {BsSearch} from 'react-icons/bs'

export default function SearchBox() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ?  `/search/?query=${query}` : '/search');
    };
  return (
    <Form className="d-flex align-items-center me-auto" onSubmit={submitHandler}>
        <InputGroup className="searchinput1">
            <FormControl type="text" name="q" id="q" onChange={(e) => setQuery(e.target.value)} placeholder="buscar productos..." aria-label="Search Products" aria-describedby="button-search">

            </FormControl>
            <Button variant="outline-primary" type="submit" id="button-search" className="boton-search">
                    <BsSearch className="lupa-search"/>
            </Button>
        </InputGroup>
    </Form>
  )
}