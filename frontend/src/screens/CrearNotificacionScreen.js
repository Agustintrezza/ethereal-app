import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Col from 'react-bootstrap/esm/Col';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import Row from 'react-bootstrap/esm/Row';
import Card from 'react-bootstrap/esm/Card';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

import {AiFillEdit} from 'react-icons/ai';
import {AiFillDelete} from 'react-icons/ai';
import {GrRefresh} from 'react-icons/gr';

import {motion} from 'framer-motion';




const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
    return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function CrearNotificacioneScreen() {

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [titlenot, setTitlenot] = useState('');
  const [contbreve, setContbreve] = useState('');
  const [contextenso, setContextenso] = useState('');


  // const params = useParams();
  const navigate = useNavigate();

    // const {slug} = params;
    // const { state } = useContext(Store);
    const [{ loading, error, successDelete }, dispatch] = useReducer(reducer, {
      loading: true,
      error: '',
    });
  // const [imgnot, setImgnot] = useState([]);

  // const [{loadingUpload},dispatch] = useReducer(reducer, {
  //   loadingUpdate: false,
  // });

  // const uploadFileHandler = async (e, forImages) => {
  //   const file = e.target.files[0];
  //   const bodyFormData = new FormData();
  //   bodyFormData.append('file', file);
  //   try {
  //     dispatch({ type: 'UPLOAD_REQUEST' });
  //     const { data } = await axios.post('/api/upload', bodyFormData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         authorization: `Bearer ${userInfo.token}`,
  //       },
  //     });
  //     dispatch({ type: 'UPLOAD_SUCCESS' });
  //     console.log(data)
  //     if (forImages) {

  //     } else {
        
  //     }
  //     toast.success('Imagen cargada exitosamente. Click en Actualizar para ejecutar los cambios');
      
  //   } catch (err) {
  //     toast.error(getError(err));
  //     dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
  //   }
  // };

  // const notificacion = {titlenot, contentnot}
  // console.log('Notificacion',notificacion);


  const [notificaciones, setNotificaciones] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/notificaciones`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        if(data) {
        setNotificaciones(data)
        } else {
            console.log('Hola')
        }
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if(successDelete) {
    //   dispatch({type:'DELETE_RESET'})
    } else {
      fetchData();
    }

    if(contbreve) {
      if (contbreve.length >= 0) {

      const mensaje = document.getElementById('mensaje');
      const contador = document.getElementById('contador');
      
      mensaje.addEventListener('input', function(e) {
        const target = e.target;
        const longitudMax = target.getAttribute('maxlength');
        const longitudAct = target.value.length;
        contador.innerHTML = `${longitudAct}/${longitudMax}`;
    });
    }
    }

    if(contextenso) {
      if (contextenso.length >= 0) {
          const mensaje1 = document.getElementById('mensaje1');
          const contador1 = document.getElementById('contador1');
          
          mensaje1.addEventListener('input', function(e) {
            const target = e.target;
            const longitudMax = target.getAttribute('maxlength');
            const longitudAct = target.value.length;
            contador1.innerHTML = `${longitudAct}/${longitudMax}`;
        });
        }
    }
    
  }, [userInfo, successDelete]);

  console.log(notificaciones);

  const submitHandler = async (e) => {
    if (window.confirm('¿Estás seguro de crear ésta notificación?')) {
    // e.preventDefault();
    try {
      const { data } = await axios.post(
        '/api/notificaciones/crear-notificacion',
        {
          titlenot,
          contbreve,
          contextenso
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      navigate('/admin/crear-notificacion')
      localStorage.setItem('notInfo', JSON.stringify(data))
      toast.success('Notificacion creada exitosamente');
    } catch (err) {
      console.log('Entro acà')
      ctxDispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  }
  };

  // const deleteFileHandler = async (fileName, f) => {
  //   setImgnot(imgnot.filter((x) => x !== fileName));
  //   toast.success('Imagen eliminada exitosamente.');
  // };

  

 
    // if(contbreve) {
    //   if (contbreve.length >= 0) {

    //   const mensaje = document.getElementById('mensaje');
    //   const contador = document.getElementById('contador');
      
    //   mensaje.addEventListener('input', function(e) {
    //     const target = e.target;
    //     const longitudMax = target.getAttribute('maxlength');
    //     const longitudAct = target.value.length;
    //     contador.innerHTML = `${longitudAct}/${longitudMax}`;
    // });
    // }
    // }

    // if(contextenso) {
    //   if (contextenso.length >= 0) {
    //       const mensaje1 = document.getElementById('mensaje1');
    //       const contador1 = document.getElementById('contador1');
          
    //       mensaje1.addEventListener('input', function(e) {
    //         const target = e.target;
    //         const longitudMax = target.getAttribute('maxlength');
    //         const longitudAct = target.value.length;
    //         contador1.innerHTML = `${longitudAct}/${longitudMax}`;
    //     });
    //     }
    // }
    

    
 

  // 
    

    


    const deleteHandler = async (x) => {
      if (window.confirm('¿Estás seguro de eliminar ésta notificación?')) {
        try {
          // dispatch({ type: 'DELETE_REQUEST' });
          await axios.delete(`/api/notificaciones/${x._id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          navigate('/admin/crear-notificacion')
          // dispatch({ type: 'DELETE_SUCCESS' });
          toast.success('Notificación eliminada exitosamente');
        } catch (error) {
          toast.error(getError(error));
          // dispatch({
          //   type: 'DELETE_FAIL',
          // });
        }
      }
    };

    const editHandler = async (x) => {
        
      // if (window.confirm('¿Estás seguro de modificar ésta notificación?')) {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/notificaciones/${x._id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          console.log(data)
          setTitlenot(data.data.titulo);
          setContbreve(data.data.contenidobreve);
          setContextenso(data.data.contenidoextenso);
          dispatch({ type: 'FETCH_SUCCESS' });
          // console.log(data.data[0].nombresubproducto);
        } catch (err) {
          dispatch({
            type: 'FETCH_FAIL',
            payload: getError(err),
          });
        } 
        // e.preventDefault();
    // }
  }

  const refrescarFormulario = () => {
      setTitlenot('');
      setContbreve('');
      setContextenso('');
  }

  const updateSubProductHandler = async(x) => {
    // e.preventDefault();
    if (window.confirm('¿Estás seguro de confirmar la siguiente modificación?')) {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const { data } = await axios.put(
        `/api/notificaciones/${x._id}`,
        { titlenot, contbreve, contextenso },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      // console.log(data);
      navigate('/notificaciones')
      toast.success('Notificación actualizada correctamente');
      // navigate('/admin/products')
      // navigate('/admin/users');
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  }
  }

    

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) :  ( 

    <div className="container-crear-notificacion">
      <Helmet>
        <title>Tu Perfil - Ethereal Tours</title>
      </Helmet>

      <div className="contenedor-titulo-crear-notificacion">
            <motion.h1 initial={{scale: 1}}
                        transition={{ duration: 1}}
                        animate= {{scale: 1.02,zIndex: 1, // x:-5, y: -10
                        duration: 2
                        }} className="titulo-crear-notificacion">Crear notificación</motion.h1>
            <Link className="enlace-link" to={'/notificaciones'}>Ver Notificaciones ({notificaciones.length})</Link>
          </div>

      <div className="contenedor-grid-crear-notificacion">

        <div>
            <form className="container" onSubmit={submitHandler}>

                <Form.Group className="mb-3" >
                  <Form.Label>Titulo/Descripción</Form.Label>
                  <Form.Control
                    value={titlenot}
                    onChange={(e) => setTitlenot(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="contenedor-input">

                  <div className="contenedor-label-card-notificacion">
                    <Form.Label className="mb-1 fs-5 label">Subtítulo de la notificación</Form.Label>
                    <div id="contador">0/50</div>
                  </div>

                    <Form.Control
                    id="mensaje"
                    // as="textarea"
                    rows={1}
                    maxLength="50"
                    name="contbreve"
                    value={contbreve}
                    onChange={(e) => setContbreve(e.target.value)}
                    // required
                    />
                </Form.Group>

                <Form.Group className="contenedor-input">

                  <div className="contenedor-label-card-notificacion">
                    <Form.Label className="mb-1 fs-5 label">Contendido de la notificación</Form.Label>
                    <div id="contador1">0/250</div>
                  </div>

                    <Form.Control
                    id="mensaje1"
                    as="textarea"
                    rows={4}
                    maxLength="250"
                    name="contextenso"
                    value={contextenso}
                    onChange={(e) => setContextenso(e.target.value)}
                    // required
                    />
                </Form.Group>


                  <div className="mb-3 d-flex justify-content-end">
                    <Button type="submit">Crear</Button>
                  </div>

            </form>
        </div>

        <div>

        {notificaciones.length === 0 ? (
            <MessageBox>
              Aún no hay notificaciones generadas. <Link to="/">Ir al menú</Link>
            </MessageBox>
          ) : (
            <>
            {notificaciones.map((x) => {

              return (<>
          
          <Card>
            <Card.Body>
              <ListGroupItem>
                  <Row>
                    <Col md={12}>
                    <motion.div initial={{scale: 1}}
                        transition={{ duration: 1}}
                        animate= {{scale: 1.01,zIndex: 1, // x:-5, y: -10
                        duration: 2
                        }} className="contenedor-card-notificacion-edicion">

                            <div className="contenedor-titular-card-notificacion">
                                <h1 className="titulo-card-notificacion">{x.titulo}</h1>

                                <div className="d-flex align-items-center">
                                  <GrRefresh className="refresh-icono" onClick={()=> refrescarFormulario()}/>
                                  <AiFillEdit className="boton-editar" onClick={() => editHandler(x)}/>
                                  <Link to={'/'}><AiFillDelete className="boton-eliminar-formulario" onClick={() => deleteHandler(x)} /></Link>
                                </div>
                            </div>
                            
                            <div className="contenedor-contenido-notificacion">
                                <p className="subtitulo-card-notificacion">{x.contenidobreve}</p>
                            </div>
                            <div className="contenedor-contenido-notificacion">
                                <p className="texto-extenso-card-notificacion">{x.contenidoextenso}</p>
                            </div>

                            <div className="contenedor-boton-actualizar-notificacion">
                              <Button className="boton-actualizar-card-notificacion mt-3" onClick={() => updateSubProductHandler(x)}>Actualizar</Button>
                            </div>
                            
                      </motion.div> 
                    </Col>
                  </Row>
                  
              </ListGroupItem>
              </Card.Body>
              </Card>
              </>)
            })}
            </>
          )}
        </div>

        
      </div>
    </div>
    
  );
  <script src="main.js"></script>
}