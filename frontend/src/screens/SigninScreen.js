import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Axios from 'axios';
import React, { useContext, useEffect, useState } from "react";
import {Store} from '../Store';
import { toast } from "react-toastify";
import { getError } from "../utils";

import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai';

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import * as yup from "yup";

const schema = yup.object().shape({
    email: yup.string().email("Formato Inválido").required("Un email válido es necesario para iniciar sesión"),
    password: yup
    .string()
    .required("El password es requerido y debe tener al menos 6 caracteres")
    .min(6, "El password debe tener al menos 6 caracteres")
    .max(15, "El password debe tener como máximo 15 caracteres"),
  });


export default function SigninScreen() {

    const {
        register,
        clearErrors,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
      });



    const navigate = useNavigate();


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const [type, setType]=useState('password');
    const [icon, setIcon]=useState(<AiFillEyeInvisible/>);
    // console.log(icon);
    

    const handleToggle=()=>{    
        if(type==='password'){
          setIcon(<AiFillEye/>);      
          setType('text');
        }
        else{
          setIcon(<AiFillEyeInvisible/>);     
          setType('password');
        }
      }
    

    const { state, dispatch: ctxDispatch } = useContext(Store);

    
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    // const userInfo = localStorage.getItem('userInfo');

    const {userInfo} = state;

    

    const submitHandler = async (e) => {
        // e.preventDefault();
        try {
            const { data } = await Axios.post('/api/users/signin', {
                email,
                password,
            });
            ctxDispatch({type: 'USER_SIGNIN', payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data))
            // navigate(redirect || '/hom');
            // window.location.href = '/hom';
            navigate("../", { replace: true });
            toast.success('!Bienvenidx! Te logueaste correctamente');
        } catch (err) {  
            toast.error(getError(err));
        }
    };

    useEffect(() => {
        if (userInfo) {
          navigate(redirect);
        }
      }, [navigate, redirect, userInfo]);

      const limipiarError = () => {
        setTimeout(() => {
            clearErrors(["email", "password"])
        }, 4000);
      }

    return (
        <Container className="small-container">
            <Helmet>
                <title>Iniciar Sesión</title>
            </Helmet>
            <h1 className="my-5">Iniciar Sesión</h1>
            <Form onSubmit={handleSubmit(submitHandler)} className="form" id="form">

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="fs-5">Email *</Form.Label>
                    <Form.Control className="mt-2 large" 
                    // type="email"
                    // required
                    {...register("email", { required: true })}
                    error={!!errors?.email}
                    helperText={errors?.email ? errors.email.message : null}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <p className="mensaje-signin"> {errors.email?.message} </p>


            <div>
                <Form.Group className="mb-3 contenedor-input-password" controlId="password">
                    <Form.Label className="fs-5">Password *</Form.Label>
                    <Form.Control className="mt-2 " 
                    type={type}
                    {...register("password", { required: true })}
                    error={!!errors?.password}
                    helperText={errors?.password ? errors.password.message : null}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="contenedor-mostrar-password">
                        {type === 'password' ? (
                            <AiFillEye onClick={handleToggle}/>
                        ) : (
                            <AiFillEyeInvisible onClick={handleToggle}/>
                        )}
                        
                    </div>
                </Form.Group>
                <p className="mensaje-signin"> {errors.password?.message} </p>

            </div>
                

                <div className="contenedor-login">
                    <div>
                        <Button className="boton-iniciar" type="submit" onClick={()=> limipiarError()}>Iniciar Sesión</Button>
                    </div>
                    <div className="olvide-password">
                        <Link to={`/forgot-password`}>Olvidé mi password</Link>
                    </div>
                </div>
                
            </Form>
        </Container>
    )
}