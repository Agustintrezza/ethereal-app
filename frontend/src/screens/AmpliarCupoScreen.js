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
  fecha: yup.string().required("La fecha del servicio es un campo obligatorio"),
  pasajeros: yup.string().required("La cantidad de pasajeros es un campo obligatorio"),
  name: yup.string().required("El nombre es un campo obligatorio"),
  email: yup.string().email("Formato Inválido").required("El email es un campo obligatorio"),
  comentario: yup.string().required("El comentario es un campo obligatorio"),
});


const AmpliarCupoScreen = () => {

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
        clearErrors(["name", "email", "comentario", "fecha", "pasajeros"])
    }, 4000);
  }

    const form = useRef();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [fecha, setFecha] = useState('');
    const [pasajeros, setPasajeros] = useState('');
    const [comentario, setComentario] = useState('');

    const submitHandler = async (e) => {
        setName('');
        setEmail('');
        setPhone('');
        setFecha('');
        setPasajeros('');
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
                  toast.success('Recibimos tu solicitud de cupo con éxito');
                },
                (error) => {
                  console.log(error.text);
                }
              );
          };
          sendEmail();
          navigate("../confirmacion-cupo", { replace: true });
          // resetForm();
          
      };


      // const resetForm = () => { 
      //   document.getElementById("form").reset();
      // }

    
    

  return (
    <div>
        <div className="container">
      <Helmet>
        <title>Ampliación de cupo - Ehtereal Tour</title>
      </Helmet>
      <h1 className="my-3 container titulo-listado-reservas">Ingresá los datos para tu solicitud y ampliá el cupo a la brevedad.</h1>
      <h2 className=" container mb-4 subtitulo-ampliacion-cupo">Recibirás contacto de un asesor a la brevedad para la confirmación y detalles de tu solicitud.</h2>
      
      <Form className="container grid" ref={form} onSubmit={handleSubmit(submitHandler)} id="#form">

    <div className="container bloque-form1">
        <Form.Group className="mb-3" controlId="fecha">
          <Form.Label>Fecha del servicio *</Form.Label>
          <Form.Control
            type="date"
            name="fecha"
            value={fecha}
            {...register("fecha", { required: true })}
                    error={!!errors?.fecha}
                    helperText={errors?.fecha ? errors.fecha.message : null}
            onChange={(e) => setFecha(e.target.value)}
            // required
          />
        </Form.Group>
        <p className="mensaje-signin"> {errors.fecha?.message} </p>

        <Form.Group className="mb-3" controlId="pasajeros">
          <Form.Label>Cantidad de pasajeros *</Form.Label>
          <Form.Control
            type="number"
            min="0"
            name="pasajeros"
            value={pasajeros}
            {...register("pasajeros", { required: true })}
                    error={!!errors?.pasajeros}
                    helperText={errors?.pasajeros ? errors.pasajeros.message : null}
            onChange={(e) => setPasajeros(e.target.value)}
            // required
          />
        </Form.Group>
        <p className="mensaje-signin"> {errors.pasajeros?.message} </p>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email de contacto *</Form.Label>
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

    </div>

    <div className="container bloque-form2">

    <Form.Group className="mb-3" controlId="name">
          <Form.Label>Ingresá tu nombre *</Form.Label>
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
          <Form.Label>Ingresá tu mensaje * <strong>(Indicá el servicio, la cantidad de pasajeros, y toda la información que creas necesaria)</strong>.</Form.Label>
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
        <p className="mensaje-signin"> {errors.comentario?.message} </p>


        <div className="mb-5 mt-4 d-flex justify-content-end">
          <Button type="submit" onClick={()=> limipiarError()}>Solicitar</Button>
        </div>

    </div>

      </Form>
    </div>



    </div>
  )
}

export default AmpliarCupoScreen