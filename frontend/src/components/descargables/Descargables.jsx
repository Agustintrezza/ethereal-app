import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import './DescargablesStyles.css';

const Descargables = () => {

    const navigate = useNavigate();

    const irGoogleDrive = () => {
        navigate('google.com')
    }

  return (
    <div className="container documentos-container">
    <Helmet>
        <title>Tarifarios y documentación</title>
    </Helmet>
        <h1 className="titulo-documentos-descargables">Tarifarios, Documentación útil y descargables.</h1>
        <h2 className="subtitulo-documentos-descargables">Haciendo <Link className="click-aqui-inicio" to={"/"}>click aquí</Link> vas a poder disponer de toda la documentación útil y necesaria, para potenciar tus ventas. Encontrarás entre otras cosa, tarifarios, descriptivos informativos y más herramientas relacionadas con la marca.</h2>
        <a href="https://www.google.com/" target="_blank" rel="noreferrer" className="contenedor-boton-descargables">
            <button className="boton-reservas-admin mt-4">Ir a Google Drive</button>
        </a>

        <a href="https://drive.google.com/file/d/17CV4G4zfAAsqTPHdQkN9MoTFG3EXidTn/view?usp=share_link" target="_blank" rel="noreferrer">Descriptivo HOWARD JOHNSON SAN PEDRO</a>

    </div>
  )
}

export default Descargables
