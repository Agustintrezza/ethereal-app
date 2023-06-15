import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import './ChatbotStyles.css';
// import {Link} from 'react-router-dom';

const theme = {
    background: '#151515c2',
    headerBgColor: '#0e6ffd',
    headerFontColor: '#fff',
    headerFontSize: '17px',
    botBubbleColor: '#eb344abd',
    botFontColor: '#fff',
    userBubbleColor: '#0e6ffd',
    userFontColor: '#fff',
}

const Chatbot = (props) => {
    const steps = [
        {
            id: '0',
            message: 'BienvenidX a e-Toursl!! Esta es un breve ruta de aplicación! cuál es tu nombre?',
            trigger: '1',
          },
          {
            id: '01',
            options: [
                {value: "y", label: "Volver al menú principal", trigger: "3"},
            ]
          },
          {
            id: '011',
            options: [
                {value: "y", label: "Volver al menú principal", trigger: "3b"},
            ]
          },
          {
            id: "1",
                user: true,
                validator: (value) => {
                    if (/^[A-Z]{1}[a-z]{2,15}$/.test(value)) {
                        return true;
                    }
                    else {
                        return 'Debe ser tu nombre y comenzar con mayúscula!';
                    }
                },
                trigger: "2"
          },
          {
                id: "2",
                message: "Hola {previousValue}!! un gusto asistirte! Tu interés tiene que ver con?",
                trigger: "3"
            },
            {
                id: "3",
                options: [
                    {value: "y", label: "Promociones", trigger: "5A"},
                    {value: "n", label: "Contacto", trigger: "5B"},
                    {value: "d", label: "Formas de pago", trigger: "5D"},
                    {value: "c", label: "Nosotros", trigger: "5C"},
                    // {value: "y", label: "Otro", trigger: "5A"},
                    // {value: "y", label: "Volver a comenzar", trigger: "5C"},
                ],
            },
            {
                id: "3b",
                options: [
                    {value: "y", label: "Promociones", trigger: "5A"},
                    {value: "n", label: "Contacto", trigger: "5B"},
                    {value: "d", label: "Formas de pago", trigger: "5D"},
                    {value: "c", label: "Nosotros", trigger: "5C"},
                    {value: "e", label: "Pude resolver mi consulta", trigger: "5E"},

                    // {value: "y", label: "Otro", trigger: "5A"},
                    // {value: "y", label: "Volver a comenzar", trigger: "5C"},
                ],
            },
            {
                id: "5A",
                // message: "Tu consulta es so",  
                component: (
                    <div className='backgroud-componente-chat'>
                   Genial! Te recomendamos leer esta <a href='https://www.nike.com' className='link-chat' target={'_blank'} rel="noreferrer">documentación</a> con la información necesaria para las integraciones. Si necesitas comunicarte de manera más directa con nosotros hacelo a través de <a href='https://www.nike.com' className='link-chat' target={'_blank'} rel="noreferrer">contacto</a>.
                   </div> 
                  ), 
                  trigger: "011",
                //   end: true
                // trigger: "seleccion"
            },
            {
                id: "5B",
                component: (
                    <div className='backgroud-componente-chat'>
                   Conocé todo el potencial de nuestra herramienta premium
                   </div> 
                  ),
                trigger: "011",
            },
            {
                id: "5C",
                component: (
                    <div className='backgroud-componente-chat'>
                   Para obtener coontacto personalizado hacé click aquí
                   </div> 
                  ),
                trigger: "011",
            },
            {
                id: "5D",
                component: (
                    <div className='backgroud-componente-chat'>
                   Obtené aquí los detalle de tu cuenta!
                   </div> 
                  ),
                trigger: "011",
            },
            {
                id: "5E",
                // user: true,
                message: "Que bueno!! Nos alegró poder asistirte para que puedas tener la mejor experiencia! Acá estamos siempre que lo requieras! Saludos!",
                // trigger: "01",
                trigger: "01",  
            },
            
      ];
  return (
    <div>
        <ThemeProvider theme={theme}>
            <div className={props.chatbot ? "contenedor-chatbot" : "contenedor-chatbot-pasive"}>
                <h1 className='cierre' onClick={props.toggleChatbot}>X</h1>
            <ChatBot steps={steps} />
            </div>
        </ThemeProvider>
       
    </div>
  )
}

export default Chatbot