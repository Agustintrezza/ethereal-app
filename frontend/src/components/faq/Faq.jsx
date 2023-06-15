import React, { useState } from 'react';
import './FaqStyles.css';
import {BsChevronDown} from 'react-icons/bs';
import {FcCollapse} from 'react-icons/fc';
import {preguntas1} from '../../Preguntasfaq';
// import {preguntas2} from '../../Preguntasfaq';

const Faq = () => {

  const [selected, setSelected] = useState(null);
  // const [selected1, setSelected1] = useState(null);

  const toggle = (id) => {
    if (selected === id) {
      return setSelected(null);
    }

    setSelected(id);
  };

  // const toggle1 = (i) => {
  //   if (selected1 === i) {
  //     return setSelected1(null);
  //   }

  //   setSelected1(i);
  // };

  return (
    <div className='container contenedor-general-faq' id="faq">
        <div className="separador">
          <p>.</p>
        </div>

        <div>
          <h1 className="text-center titulo-principal-faq">Preguntas Frecuentes</h1>
          {/* <h2 className='subtitulo-progress'>Despejá todas las dudas frecuentes en la siguiente sección.</h2> */}
        </div>
        
        
        <div className="contenedor-faq">

          <div className="primer-contenedor">
              {preguntas1.map((item, id)=> (
                <div key={id} className="contenedor-pregunta">
                <h1 className="pregunta" onClick={() => toggle(id)}>{item.pregunta} <strong className='ms-4'>{selected === id ? <FcCollapse/> : <BsChevronDown/> }</strong></h1>

                <div className={selected === id ? "content show" : "content"}>
                {item.respuesta}
                </div>

              </div>
              ))}
          </div>

          {/* <div className="segundo-contenedor">
              {preguntas2.map((data, i)=> (
                  <div className="contenedor-pregunta">
                  <h1 className="pregunta text-center" onClick={() => toggle1(i)}>{data.pregunta} <strong className='ms-4'>{selected1 === i ? <FcCollapse/> : <BsChevronDown/> }</strong></h1>

                  <div className={selected1 === i ? "content show" : "content"}>
                  {data.respuesta}
                  </div>

                </div>
                ))}
          </div> */}
      
      </div>

    </div>
  )
}

export default Faq