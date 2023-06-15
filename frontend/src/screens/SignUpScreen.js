import Container from "react-bootstrap/esm/Container";
import { Helmet } from "react-helmet-async";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useLocation, useNavigate } from "react-router-dom";
import Axios from 'axios';
import { useContext, useState } from "react";
import {Store} from '../Store';
import { toast } from "react-toastify";
import { getError } from "../utils";


export default function SignupScreen() {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // const [favoritos, setFavoritos] = useState(['Agus']);

    const [isAdmin, setIsAdmin] = useState(false);


    const { dispatch: ctxDispatch } = useContext(Store);

    // const {userInfo} = state;
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('Los password deben ser idénticos');
            return
        }
        try {
            const { data } = await Axios.post('/api/users/signup', {
                name,
                email,
                phone,
                password,
                isAdmin
            });
            // const dataconfavoritos = {...data, favoritos:favoritos}
            ctxDispatch({type: 'USER_SIGNIN', payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data))
            navigate(redirect || '/');
        } catch (err) {  
            toast.error(getError(err));
        }
    };

    // useEffect(() => {
    //     if (userInfo) {
    //       navigate(redirect);
    //     }
    //   }, [navigate, redirect, userInfo]);

    return (
        <Container className="small-container-crear-usuario">
            <Helmet>
                <title>Crear Usuario</title>
            </Helmet>
            <h1 className="my-3">Crear Usuario</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
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
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmpassword">
                    <Form.Label>Confirmar Password</Form.Label>
                    <Form.Control type="password" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                </Form.Group>
                
                <Form.Check
                    className="mb-3 fs-4 mt-4"
                    type="checkbox"
                    id="isAdmin"
                    label="Crear como administrador"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                />


                <div className="contenedor-button-crear-usuario">
                    <Button className="button-crear-usuario" type="submit">Crear usuario</Button>
                </div>
                
                {/* <div className="mb-3">
                    Ya tenés tu cuenta? {' '}
                    <Link to={`/signin?redirect=${redirect}`}>Iniciá Sesión</Link>
                </div> */}
            </Form>
        </Container>
    )
}