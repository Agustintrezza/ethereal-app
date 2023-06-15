import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Helmet } from 'react-helmet-async';
import Form from "react-bootstrap/Form";
// import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import {AiFillEdit} from 'react-icons/ai';



const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });


  const { state } = useContext(Store);
  const { userInfo } = state;

  const [horarioReservas, setHorarioReservas] = useState('')

  const [horariogeneral, setHorariogeneral] = useState('')
  console.log(horariogeneral)

  const [horarioTango, setHorariotango] = useState('')
  const [horariogeneraltango, setHorariogeneraltango] = useState('');
  console.log(horariogeneraltango)


  const horarios = {horarioReservas, horarioTango}
  console.log(horarios)

  const [configuracion, setConfiguracion] = useState([])

  const navigate = useNavigate();


  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const { data } = await axios.get('/api/configuraciones', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setConfiguracion(data)
        
        if(data[0].horaReserva) {
          setHorariogeneral(data[0].horaReserva)
        }
        if(data[0].horaTango) {
          setHorariogeneraltango(data[0].horaTango)
        }
        
        // dispatch({ type: 'FETCH_SUCCESS', payload: info });
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData1();
  },[userInfo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        // console.log(data)
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  // const [ampliacionDays, setAmpliaciondays] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      // console.log('Entro a fetchData', userInfo.token)
      try {
        // dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/ampliacion`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        // dispatch({ type: 'FETCH_SUCCESS', payload: data });
        // setAmpliaciondays(data);
        console.log(data);
        // return {booked: stockDays}
      } 
      catch (err) {
        console.log('Error catch')
      }
      
    };

    fetchStock();
    
  }, [userInfo.token ]);


  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const { data } = await axios.post(
  //       `/api/configuraciones/configuracion-horarios`,
  //       {
  //         horarioReservas,
  //         horarioTango,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${userInfo.token}` },
  //       }
  //     );
  //     localStorage.setItem('notInfo', JSON.stringify(data))
  //     toast.success('Horario ingresado exitosamente');
  //   } catch (err) {
  //     console.log('Entro acà')
  //     ctxDispatch({
  //       type: 'FETCH_FAIL',
  //     });
  //     toast.error(getError(err));
  //   }
  // }

  const llamarDataHandler = async () => {
    try {
      const { data } = await axios.get('/api/configuraciones', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setConfiguracion(data)
      
      if(data[0].horaReserva) {
        // setHorariogeneral(data[0].horaReserva)
        setHorarioReservas(data[0].horaReserva)
      }
      if(data[0].horaTango) {
        // setHorariogeneraltango(data[0].horaTango)
        setHorariotango(data[0].horaTango)
      }
      
      // dispatch({ type: 'FETCH_SUCCESS', payload: info });
    } catch (err) {
      toast.error(getError(err));
      // dispatch({
      //   type: 'FETCH_FAIL',
      //   payload: getError(err),
      // });
    }
  };

  

  const editarHoraHandler = async(x) => {
    // e.preventDefault();
      try {
        dispatch({ type: 'UPDATE_REQUEST' });
        const { data } = await axios.put(
          `/api/configuraciones/configuracion-horarios/${x._id}`,
          { 
            horarioReservas,
            horarioTango, 
          },  
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: 'UPDATE_SUCCESS',
        });
        console.log(data);
        toast.success('Horario actualizado exitosamente');
      } catch (error) {
        toast.error(getError(error));
        dispatch({ type: 'UPDATE_FAIL' });
      }
    
  }  

  return (
    <div className='container mt-5'>
      <Helmet>
        <title>Datos Generales - Administrador</title>
      </Helmet>
      <h1 className='py-3 mb-5'>Configuración de horarios</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
        <div className="d-flex flex-column">
          <div className="grid-configuraciones-dashboard">

            <div>
              {configuracion.map((x) => (
                <>
                <div key={x}>
                  <div className="contenedor-configuracion-horarios">
                      <h1 className="titulo-configuracion-hora"><strong>Horarios </strong>límite para <strong>tours y paquetes</strong>.</h1>
                      <h4 className="configuracion-hora">{x.horaReserva}hs</h4>
                  </div>
                  
                  <div className="contenedor-configuracion-horarios">
                      <h1 className="titulo-configuracion-hora"><strong>Horarios </strong>límite para reservar <strong>tangos</strong> en el día.</h1>
                      <h4 className="configuracion-hora">{x.horaTango}hs</h4>
                  </div>
                  
                </div>
                <div className="contenedor-editar">
                  <AiFillEdit className="boton-editar-horario" onClick={() => llamarDataHandler(x)}/>
                </div>
                </>
              ))}
              

            </div>
            
            <div>
              {/* <h4>Configuración de horarios del sitio</h4> */}
              <Form onSubmit={editarHoraHandler}>
              <Form.Group className="mb-3">
                  <Form.Label className="mb-1 fs-5 label">
                    Horario límite general para reservar tours y paquetes
                  </Form.Label>
                  <Form.Control
                    value={horarioReservas}
                    onChange={(e) => setHorarioReservas(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="mb-1 fs-5 label">
                    Horario límite para reservar tangos en el día
                  </Form.Label>
                  <Form.Control
                    value={horarioTango}
                    onChange={(e) => setHorariotango(e.target.value)}
                    required
                  />
                </Form.Group>

                {configuracion.map((x) => (
                  <div className="mb-3 d-flex justify-content-end">
                    <button className="boton-actualizar" onClick={(e)=> {
                      if(window.confirm(`¿Estás seguro que querés modificar el siguiente horario?`)) {
                        editarHoraHandler(x);
                        navigate('/admin/dashboard')
                      } else {
                        e.preventDefault();
                      }
                    }}
                    >Actualizar</button>
                  </div>
                ))}
                

              </Form>
            </div>
            
          </div>


          <Row className="contenedor-tarjetas-dashboard">
            <Col className="tarjeta-dashboard">
              <Card>
                <Card.Body className="body-dashboard">
                  <Card.Title className="titulo-card-dashboard">
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text className="text-card-dashboard"> Usuarios Registrados <strong className="summary-dashboard">Admin: {summary.admin}, Vendedores: {summary.notadmin}</strong> </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col className="tarjeta-dashboard-2">
              <Card>
                <Card.Body className="body-dashboard-2">
                  <Card.Title className="titulo-card-dashboard">
                    {summary.products && summary.products[0]
                      ? summary.products[0].numProducts
                      : 0}
                  </Card.Title>
                  <Card.Text className="text-card-dashboard"> Productos Registrados <strong className="summary-dashboard">Tours: {summary.tour}, Tangos: {summary.tangos}, Paquetes: {summary.paquete}</strong></Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col className="tarjeta-dashboard-3">
              <Card>
                <Card.Body className="body-dashboard-3">
                  <Card.Title className="titulo-card-dashboard">
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </Card.Title>
                  <Card.Text className="text-card-dashboard"> Órdenes <strong className="summary-dashboard">Confirmadas: {summary.delivered}, Pendientes: {summary.notdelivered}</strong> </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    $
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                  <Card.Text>Total de las Ordenes</Card.Text>
                </Card.Body>
              </Card>
            </Col> */}
          </Row>
          <div className="my-3">
            <h2 className='mt-5 py-3'>Ventas</h2>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>Áun no hay ventas!</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales'],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}
          </div>
          <div className="my-3">
            <h2>Categorías</h2>
            {summary.productCategories.length === 0 ? (
              <MessageBox>No hay categorías</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
