import React from 'react';
// import QRCode from "react-qr-code";
import QRCode from 'qrcode';
import { useState } from 'react'
import './QrStyles.css';
import {FiDownload} from 'react-icons/fi';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';



const FirstQrScreen = () => {

  const [url, setUrl] = useState('')
	const [qr, setQr] = useState('')

  const [nombrepunto, setNombrepunto] = useState('');
  const [idpunto, setIdpunto] = useState('');

  const GenerateQRCode = () => {
    console.log('esta disparando la funcion')
		QRCode.toDataURL(url, {
			// width: 800,
			// margin: 0,
			color: {
				dark: '#335383FF',
				light: '#EEEEEEFF'
			}
		}, (err, url) => {
			if (err) return console.error(err)

			console.log(url)
			setQr(url)
		})
	}

  const submitHandler = (e) => {
    e.preventDefault(e);
    console.log('DisparaSubmitHanlder')
    console.log('nombrepunto', nombrepunto)
    console.log('idpunto', idpunto);
  }

  return (  

    <div className="contenedor-general-qr">
       
      <div>
        
        

        <Form onSubmit={(e)=>submitHandler}>

        <Form.Group className="mb-3">
          <Form.Label>Nombre del punto *</Form.Label>
          <Form.Control
            type="text"
            value={nombrepunto}
            name="nombre"
            onChange={(e) => setNombrepunto(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Id del punto (de tipo numérico) *</Form.Label>
          <Form.Control
            type="text"
            value={idpunto}
            name="idpunto"
            onChange={(e) => setIdpunto(e.target.value)}
            required
          />
        </Form.Group>

        <Button onClick={(e)=> submitHandler(e)}>Registrar punto</Button>


        </Form>
      </div>

      <div className="contenedor-interno-qr">
          <div>
            <h1 className="titulo-generador-qr">Generar QR para punto de venta</h1>
            <input 
              className="input-qr"
              type="text"
              placeholder="e.g. https://google.com/1"
              value={url}
              onChange={e => setUrl(e.target.value)} />

            <div className="contenedor-boton-generar-qr">
                <button className="boton-generar-qr" onClick={GenerateQRCode}>Generar Qr</button>
            </div>
          </div>

          <div className="contenedor-imagen-qr">
              {qr && <>
                <div className="contenedor-final-interno-img-qr">
                  <img className="img-generador-qr" src={qr} alt="qr"/>
                  <a className="boton-dercargar-qr" href={qr} download="qrcode.png"><FiDownload className="icono-descargar"/></a>
                </div>
               


                {/* <div className="contenedor-boton-descargar-qr">
                  <a className="boton-dercargar-qr" href={qr} download="qrcode.png"><FiDownload/></a>
                </div> */}
              </>}
          </div>

          
      </div>
		</div>





    // <div className="my-5">
    //     <div className="d-flex justify-content-center align-items-center my-5">
    //         <h1>Kanoo Ethereal Tours</h1>   
    //     </div>

    //   <div className="d-flex justify-content-around">
    //     <div id="primero" className="d-flex justify-content-center align-items-center my-5" style={{ background: 'white', padding: '16px' }}>
    //           <QRCode value="www.nike.com"/>  
    //       </div>  
    //       <div id="segundo" className="d-flex justify-content-center align-items-center my-5" style={{ background: 'white', padding: '16px' }}>
    //           <QRCode value="www.google.com"/>  
    //       </div> 
    //       <div id="tercero" className="d-flex justify-content-center align-items-center my-5" style={{ background: 'white', padding: '16px' }}>
    //           <QRCode value="www.youtube.com"/>  
    //       </div>  
    //   </div>
           
    // </div>
  )
}

export default FirstQrScreen