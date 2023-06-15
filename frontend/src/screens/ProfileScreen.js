import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { Link } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [phone, setPhone] = useState(userInfo.phone);

  // const [password, setPassword] = useState('');
  // const [ setConfirmPassword] = useState('');

  const [dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });


  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          phone,
          // password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      // dispatch({
      //   type: 'UPDATE_SUCCESS',
      // });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Usuario actualizado exitosamente');
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>Tu Perfil - Ethereal Tours</title>
      </Helmet>
      <h1 className="my-3 container titulo-listado-reservas">Perfil de usuario</h1>
      <form className="container" onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </Form.Group>

        <div className="contenedor-boton-link-perfil">
          <div className="mb-3">
            <Button type="submit">Actualizar</Button>
          </div>
          <div>
            <Link className="cambiar-password" to={"/change-password"}>Cambiar contraseña</Link>
          </div>
        </div>
        

      </form>

      

    </div>
  );
}