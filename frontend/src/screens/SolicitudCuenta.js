import React, {useRef, useState} from 'react'
import './SolicitudCuentaStyles.css';
// import Form from 'react-bootstrap/Form';
// import { Helmet } from 'react-helmet-async';
import emailjs from "@emailjs/browser";
// import Button from 'react-bootstrap/Button';
import {useNavigate} from 'react-router-dom';
// import logohorizontal from '../assets/logos/logo-horizontal.png';
// import logocircular from '../assets/logos/logo-ethereal.jpeg';
import logosimple from '../assets/logos/logo-simple.png';
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

const SolicitudCuenta = () => {

    const navigate = useNavigate();

    const {
        clearErrors,
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
    console.log(name)
    const [email, setEmail] = useState('');
    console.log(email)
    const [phone, setPhone] = useState('');
    console.log(phone)
    const [comentario, setComentario] = useState('');
    console.log(comentario)


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
    <motion.div initial={{scale: 1}}
    transition={{ duration: 1}}
    animate= {{scale: 1.01,zIndex: 1, // x:-5, y: -10
    duration: 1
    }} className="contenedor-solicitud-cuenta">

        <div className="contenedor-titulo-logo">
            <div>
                <h1 className="titulo-solicitud-cuenta">¡Completá tu solicitud! validá tu cuenta y comenzá a operar con nosotros.</h1>
            </div>
            {/* <div className="contenedor-logo">
                <img className='logo-ethereal-circular-solicitud' src={logocircular} alt="logo-ethereal"/>
            </div> */}
        </div>

    
        <div className="grid-solicitud-cuenta">

            <div className="contenedor-grid-texto">
                <div className="contenedor-pregunta">
                    <p className="texto">La <strong className="strong-experiencia">EXPERIENCIA</strong> es nuestro mayor tesoro, la que nos ha permitido a lo largo de estos casi 30 años, estar cerca de nuestros partners y clientes para encontrar juntos, el camino para seguir creciendo, innovando, y continuar produciendo emociones y sorprendiéndonos en cada paquete o pasajeros que recibimos.
                    </p>
                </div>
            
                <div className="contenedor-macro">
                    <div className="contenedor-pregunta">
                        <h1 className="preguntas">¿Porqué trabajar con nosotros?</h1>
                        <p className="respuesta">Nuestra agencia tiene los mejores servicios receptivos en Buenos Aires. Los mejores traslados, <br></br>
                         guías capacitados, y los mejores precios.
                        </p>
                    </div>
                </div>
                {/* <div className="contenedor-pregunta">
                    <h1 className="preguntas">¿Porqué trabajar con nosotros?</h1>
                    <p className="respuesta">Nuestra agencia tiene los mejores servicios receptivos en Buenos Aires. <br></br>
                    Los mejores traslados, guías capacitados, y los mejores precios.
                    </p>
                </div> */}

            </div>

            <div>
                <motion.div initial={{scale: 1}}
                transition={{ duration: 1}}
                animate= {{scale: 1.04,zIndex: 1, // x:-5, y: -10
                duration: 3
                }} className="contenedor-enlace-solicitud-cuenta">
                    <Link className="boton-solicitud-cuenta" to={'/solicitud-cuenta-registro'}>Completar solicitud</Link>
                </motion.div>

                <div className="contenedor-logo-centrado">   
                    <motion.img initial={{scale: 1}}
                transition={{ duration: 1}}
                animate= {{scale: 1.04,zIndex: 1, // x:-5, y: -10
                duration: 3
                }} className='logo-ethereal-simple-solicitud' src={logosimple} alt="logo-ethereal"/>   
                </div>
                
            </div>

        </div>
        
    </motion.div>
  )
}

export default SolicitudCuenta