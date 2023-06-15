import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from "react";
import { toast } from "react-toastify";
import Axios from "axios";
import { getError } from "../utils";


export default function ChangePasswordScreen() {
    
    const [email, setEmail] = useState("");


    const postData = async (e) => {
        e.preventDefault();
        try {
            const { data } = await Axios.post('/api/forgot-password', {
                email                
            });
            console.log(data);
            toast.success('Enlace para restablecer la contraseña enviado a la cassilla de correo ingresada');
        } catch (err) {
            toast.error(getError(err));
        }
    }

    return (
        <Container className="small-container">
            <Helmet>
                <title>Iniciar Sesión</title>
            </Helmet>
            <h1 className="my-5 titulo-cambiar-contraseña">Validá tu cuenta y cambiá tu contraseña.</h1>
            <h4 className="my-5 subtitulo-cambiar-contraseña">Ingresá la casilla de email de tu cuenta, validá y cambiá tu contraseña. </h4>
            <Form onSubmit={postData}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="fs-5">Email</Form.Label>
                    <Form.Control className="mt-2 large" type="email" required onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>
                <div className="contenedor-login">
                    <div>
                        <Button className="fs-5" type="submit">Enviar</Button>
                    </div>
                </div>
                
            </Form>
        </Container>
    )
}