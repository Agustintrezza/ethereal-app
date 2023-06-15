import Container from "react-bootstrap/esm/Container";
import { Helmet } from "react-helmet-async";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate, useParams } from "react-router-dom";
// import { useLocation, useNavigate, useParams } from "react-router-dom";

// import Axios from 'axios';
import { useContext, useState, useEffect, useReducer } from "react";
import {Store} from '../Store';
import { toast } from "react-toastify";
import { getError } from "../utils";
// import LoadingBox from '../components/LoadingBox';
// import MessageBox from '../components/MessageBox';
import axios from "axios";

const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
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


export default function ResetPasswordScreen() {

    

      // const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
      //   loading: true,
      //   error: '',
      // });
    
    

    const navigate = useNavigate();
    const params = useParams();

    const { state } = useContext(Store);
    const { userInfo } = state;
    
    const { id: userId } = params;

    // const { dispatch: ctxDispatch } = useContext(Store);
    // const {userInfo} = state;
    // const { search } = useLocation();
    // const redirectInUrl = new URLSearchParams(search).get('redirect');
    // const redirect = redirectInUrl ? redirectInUrl : '/';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [, dispatch] = useReducer(reducer, {
      loading: true,
      error: '',
    });

    useEffect(() => {
      
        const fetchData = async () => {
          try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(`/api/users/${userId}`, {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            console.log(data)
            // setPassword(data.password)
            // setConfirmPassword(data.confirmPassword)
            dispatch({ type: 'FETCH_SUCCESS' });
          } catch (err) {
            dispatch({
              type: 'FETCH_FAIL',
              payload: getError(err),
            });
          }
        };
        fetchData();
      }, [userId, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('Los password deben ser idénticos');
            return
        }
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(
                `/api/users/reset/${userId}`,
                { _id: userId, password, confirmPassword },
                // {
                // headers: { Authorization: `Bearer ${userInfo.token}` },
                // }
            );
            dispatch({
                type: 'UPDATE_SUCCESS',
              });
              toast.success('Usuario actualizado exitosamente');
              navigate('/admin/users');
            // const { data } = await Axios.post('/api/users/reset', {
            //     // name,
            //     // email,
            //     // phone,
            //     password,
            //     confirmPassword
            // });
            // ctxDispatch({type: 'USER_SIGNIN', payload: data})
            // localStorage.setItem('userInfo', JSON.stringify(data))
            // navigate(redirect || '/');
        } catch (error) {
            toast.error(getError(error));
            dispatch({ type: 'UPDATE_FAIL' });
        }
    };

    // useEffect(() => {
    //     if (userInfo) {
    //       navigate(redirect);
    //     }
    //   }, [navigate, redirect, userInfo]);a

    return (
        <Container className="small-container">
            <Helmet>
                <title>Ingresar</title>
            </Helmet>
            <h1 className="my-3">Ingresá tu nuevo password</h1>
            <Form onSubmit={submitHandler}>
                {/* <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control onChange={(e) => setName(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control type="text" required onChange={(e) => setPhone(e.target.value)}/>
                </Form.Group> */}
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmpassword">
                    <Form.Label>Confirmar Password</Form.Label>
                    <Form.Control type="password" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Reestablecer</Button>
                </div>
                
                {/* <div className="mb-3">
                    Ya tenés tu cuenta? {' '}
                    <Link to={`/signin?redirect=${redirect}`}>Iniciá Sesión</Link>
                </div> */}
            </Form>
        </Container>
    )
}