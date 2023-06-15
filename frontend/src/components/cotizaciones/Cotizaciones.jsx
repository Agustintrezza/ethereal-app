import React, {useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import emailjs from "@emailjs/browser";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  name: yup.string().required("El nombre es un campo obligatorio"),
  email: yup.string().email("Formato Inválido").required("El email es un campo obligatorio"),
  comentario: yup.string().required("El comentario es un campo obligatorio"),
});


const Cotizaciones = () => {

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
        clearErrors(["name", "email", "comentario"])
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


      // const resetForm = () => { 
      //   document.getElementById("form").reset();
      // }

    
    

  return (
    <div>
        <div className="container small-container">
      <Helmet>
        <title>Cotizaciones - Ehtereal Tour</title>
      </Helmet>
      {/* <h1 className="my-3 container titulo-listado-reservas">Pedinos tu cotización. Recibí contacto a la brevedad</h1> */}

      {/* <h1 className="my-3 container titulo-listado-reservas">Realizá la mejor <a href="https://forms.gle/FZJY5eZE4sKa5hyXA" target="_blank" rel="noreferrer">cotización</a> a medida para tu servicio</h1> */}
      <h1 className="my-3 container titulo-listado-reservas">Realizá la mejor <a href="https://docs.google.com/forms/d/e/1FAIpQLSdNzsbum2tYUzcFXgiSwaDnJNf9wPHc8zAG7AMBYx339WF7WA/viewform?usp=sf_link" target="_blank" rel="noreferrer">cotización</a> a medida para tu servicio</h1>

      
      
      {/* <Form className="container" ref={form} onSubmit={handleSubmit(submitHandler)} id="#form">

        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nombre *</Form.Label>
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
        <p className="mensaje-signin"> {errors.name?.message} </p>


        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email *</Form.Label>
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
        <p className="mensaje-signin"> {errors.email?.message} </p>

        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>Teléfono de contacto</Form.Label>
          <Form.Control
            type="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            // required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="comentario">
          <Form.Label>Ingresá tu mensaje *</Form.Label>
          <Form.Control
            
            as="textarea"
            name="comentario"
            rows={3}
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
        <p className="mensaje-signin"> {errors.comentario?.message} </p>

        <div className="mb-3 d-flex justify-content-start contenedor-boton-cotizaciones">
          <Button type="submit" onClick={()=> limipiarError()}>Enviar</Button>
        </div>

      </Form> */}

    </div>



    </div>
  )
}

export default Cotizaciones
