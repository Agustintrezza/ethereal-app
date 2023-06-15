import React from 'react';
import './Formulariofiltro.css';
import {FaPlaneDeparture} from 'react-icons/fa';
import {MdCardTravel} from 'react-icons/md';
import {BsCalendarCheck} from 'react-icons/bs';
import {FaUsers} from 'react-icons/fa'

const Formulariofiltro = () => {
  return (
    <div className='contenedor-general-formulariofiltro d-flex align-items-center py-5'>

        <form className='container-formulario-filtro align-items-center formulario'>

                    <div className="d-flex flex-column align-items-start">   
                        
                        <div className=''>
                            <h1 className='titulo-formulario'>Filtrá tu Búsqueda! <FaPlaneDeparture className="logo-avion"/></h1>

                            <div className=''>
                                <h3 className='sutitulo-formulario'>Filtrá y conoce los mejores resultados con grande promociones!</h3>
                            </div>

                            <div className='d-flex py-4 radios'>
                                <div className="form-check radio-buttons fs-5 m-0">
                                    <label className="form-check-label" htmlFor="1">Opción 1</label>
                                    <input className="form-check-input" name="tipo" id="1" type="radio"/>     
                                </div>  

                                <div className="form-check radio-buttons fs-5">
                                    <label className="form-check-label" htmlFor="2">Opción 3</label>
                                    <input className="form-check-input" name="tipo" id="2" type="radio"/>
                                </div> 
                            </div> 
                        </div>
                        

                    </div>

                    <div className='d-flex row g-4'>
                            <div className="col-md-4">
                                <div className='d-flex align-items-center mb-2'>
                                        <label className="form-label fs-5" htmlFor="5">Tipo de viaje </label>
                                        <MdCardTravel className='logo-label'/>
                                </div>
                                <select className="form-control input" id="5">
                                    <option value="">--Seleccione--</option>
                                    <option value="MX">Opción 1</option>
                                    <option value="PR">Opción 2</option>
                                    <option value="CO">Opción 3</option>
                                    <option value="AR">Opción 4</option>
                                    <option value="ES">Opción 5</option>
                                    <option value="CL">Opción 6</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <div className='d-flex align-items-center mb-2'>
                                    <label className="form-label fs-5" htmlFor="3">Fecha deseada</label>
                                    <BsCalendarCheck className='logo-label'/>
                                </div>
                                

                                <input type="date" id="3" className="form-control input" required/>
                            </div>
                            <div className="col-md-4">
                                <div className='d-flex align-items-center mb-2'>
                                    <label className="form-label fs-5" htmlFor="4">Cantidad de Personas</label>
                                    <FaUsers className='logo-label'/>
                                </div>
                                <input type="number" id="4" className="form-control input" min={0} required/>
                            </div>
                    </div>


                    <div className="d-flex justify-content-between align-items-center pt-4">
                            <div className="form-check form-switch p-0 text-start fs-4">
                                <input className="form-check-input switch fs-2" type="checkbox" role="switch" id="flexSwitchCheckChecked"/>
                                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Cualquier fecha más barata</label>
                            </div>
                            <div>
                                <button className='btn btn-primary fs-3 p-3 boton-formulario'>Buscar</button>
                            </div>
                    </div>
        </form>
    </div>
  )
}

export default Formulariofiltro