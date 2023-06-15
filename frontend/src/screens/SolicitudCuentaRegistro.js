import React, {useRef, useState} from 'react'
import './SolicitudCuentaStyles.css';
import Form from 'react-bootstrap/Form';
// import { Helmet } from 'react-helmet-async';
import emailjs from "@emailjs/browser";
import Button from 'react-bootstrap/Button';
import {useNavigate} from 'react-router-dom';
// import logohorizontal from '../assets/logos/logo-horizontal.png';
// import logocircular from '../assets/logos/logo-ethereal.jpeg';
// import logosimple from '../assets/logos/logo-simple.png';
import {BiArrowBack} from 'react-icons/bi';
import {motion} from 'framer-motion';



import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


const phoneRegExp = /^((?:\(?\d{2}\)?[- .]?\d{4}|\(?\d{4}\)?[- .]?\d{3}|\(?\d{5}\)?[- .]?\d{2})[- .]?\d{4})$/

const schema = yup.object().shape({
    name: yup.string().required("El nombre de la agencia es un campo obligatorio"),
    email: yup.string().email("Formato Inválido").required("El email es un campo obligatorio"),
    comentario: yup.string().required("El comentario es un campo obligatorio"),
    phone: yup.string().matches(phoneRegExp, 'Formáto de teléfono inválido'),
  });

const SolicitudCuentaRegistro = () => {

    const navigate = useNavigate();

    const {
        register,
        clearErrors,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const limipiarError = () => {
        setTimeout(() => {  
            clearErrors(["name", "email", "comentario", "phone"])
        }, 4000);
    }

    const form = useRef();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [comentario, setComentario] = useState('');

    const submitHandler = async (e) => {
        setName('');
        setEmail('');
        setPhone('');
        setComentario('');
        // e.preventDefault();
        
        const sendEmail = (e) => {
            // e.preventDefault();
            console.log('Se ejecuto');
            emailjs
              .sendForm(
                "service_l282097",
                "template_sfatx9d",
                form.current,
                "b6NNLnqS-HA4bOb2s",
              )
              .then(
                (result) => {   
                  console.log(result.text);
                  toast.success('Recibimos tu cotización con éxito');
                },
                (error) => {
                  console.log(error.text);
                }
              );
          };
          sendEmail();
          navigate("../confirmacion-cotizacion", { replace: true });
          // resetForm();
          
      };


  return (
    <div className="contenedor-solicitud-cuenta">

        <div className="grid-solicitud-cuenta-fomulario">

            <div className="contenedor-macro">
                <div className="boton-volver">
                <Link className='enlace-flecha-volver' to={'/solicitud-cuenta'}><BiArrowBack/></Link>
               </div>
            
                <div>
                    <motion.h1 initial={{scale: 1}}
                        transition={{ duration: 1}}
                        animate= {{scale: 1.01,zIndex: 1, // x:-5, y: -10
                        duration: 1
                        }} className="titulo-registro-solicitud"><strong>Completá los datos y envía tu solicitud.</strong> Tu cuenta será confirmada en 24hs.</motion.h1>
                    <p className="texto-registro-solicitud">Una vez confirmada, tendrás acceso a reservar los mejores servicios, ser parte de nuestro sistema de tarifas,
                        comisiones y premiaciones</p>
                </div>
                {/* <div className="contenedor-logo-circular">
                    <img className='logo-ethereal-circular-solicitud' src={logocircular} alt="logo-ethereal"/> 
                </div> */}
            </div>
            

            <div className='contenedor-formulario'>
                {/* <h1 className="titulo-formulario">Completá tu solicitud </h1> */}
                <motion.Form initial={{scale: 1}}
                transition={{ duration: 1}}
                animate= {{scale: 1.004,zIndex: 1, // x:-5, y: -10
                duration: 1
                }} className="container" ref={form} onSubmit={handleSubmit(submitHandler)} id="#form">
                        <Form.Group className="input-formulario-solicitud-cuenta" controlId="name">
                        <Form.Label className="label-formulario-solicitud-cuenta">Nombre de la agencia <strong className="asterico-campo-obligatorio">*</strong></Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            name="name"
                            {...register("name", { required: true })}
                                    error={!!errors?.name}
                                    helperText={errors?.name ? errors.name.message : null}
                            onChange={(e) => setName(e.target.value)}
                            // required
                        />
                        </Form.Group>
                        <p className="mensaje-validacion-solicitar-cuenta"> {errors.name?.message} </p>


                        <Form.Group className="input-formulario-solicitud-cuenta" controlId="email">
                        <Form.Label className="label-formulario-solicitud-cuenta">Email <strong className="asterico-campo-obligatorio">*</strong></Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={email}
                            {...register("email", { required: true })}
                                    error={!!errors?.email}
                                    helperText={errors?.email ? errors.email.message : null}
                            onChange={(e) => setEmail(e.target.value)}
                            // required
                        />
                        </Form.Group>
                        <p className="mensaje-validacion-solicitar-cuenta"> {errors.email?.message} </p>

                        <Form.Group className="input-formulario-solicitud-cuenta" controlId="phone">
                        <Form.Label className="label-formulario-solicitud-cuenta">Teléfono de contacto (formato 11-32343454) <strong className="asterico-campo-obligatorio">*</strong></Form.Label>
                        <Form.Control
                            type="phone"
                            name="phone"
                            value={phone}
                            {...register("phone", { required: true })}
                                    error={!!errors?.phone}
                                    helperText={errors?.phone ? errors.phone.message : null}
                            onChange={(e) => setPhone(e.target.value)}
                            // required
                        />
                        </Form.Group>
                        <p className="mensaje-validacion-solicitar-cuenta"> {errors.phone?.message} </p>
                        

                        <Form.Group className="input-formulario-solicitud-cuenta" controlId="comentario">
                        <Form.Label className="label-formulario-solicitud-cuenta">Ingresá tu mensaje <strong className="asterico-campo-obligatorio">*</strong></Form.Label>
                        <Form.Control
                            
                            as="textarea"
                            name="comentario"
                            rows={2}
                            value={comentario}
                            // type="phone"
                            // value={phone}
                            {...register("comentario", { required: true })}
                                    error={!!errors?.comentario}
                                    helperText={errors?.comentario ? errors.comentario.message : null}
                            onChange={(e) => setComentario(e.target.value)}
                            // required
                        />
                        </Form.Group>
                        <p className="mensaje-validacion-solicitar-cuenta"> {errors.comentario?.message} </p>

                        <div className="contenedor-boton">
                            <Button className="boton-card-all-solicitud-cuenta" type="submit" onClick={()=> limipiarError()}>Solicitar</Button>
                        </div>

                </motion.Form>
            </div>
        </div>
    </div>
  )
}

export default SolicitudCuentaRegistro