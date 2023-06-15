import React, { useContext, useEffect, useReducer, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../../Store';
import { getError } from '../../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import ListGroup from 'react-bootstrap/ListGroup';
import { Editor } from '@tinymce/tinymce-react';


import eachWeekOfInterval from 'date-fns/eachWeekOfInterval'
import {AiFillEdit} from 'react-icons/ai';
import {AiFillDelete} from 'react-icons/ai';
import {AiOutlineCar, AiOutlineClockCircle} from 'react-icons/ai';
import { MdFoodBank, MdOutlineLocalHospital } from "react-icons/md";
// import { GoComment } from "react-icons/go";
import { BiBed } from "react-icons/bi";


// import {AiOutlineCar, AiOutlineClockCircle} from 'react-icons/ai';
// import { MdFoodBank, MdOutlineLocalHospital } from "react-icons/md";
// import { GoComment } from "react-icons/go";
// import { BiBed } from "react-icons/bi";
import './FormularioTangoStyles.css';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import es from 'date-fns/locale/es';
import {format, parseISO} from 'date-fns';

const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
        case 'UPDATE_REQUEST':
        return { ...state, loadingUpdate: true };
      case 'UPDATE_SUCCESS':
        return { ...state, loadingUpdate: false };
      case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
      case 'UPLOAD_REQUEST':
        return { ...state, loadingUpload: true, errorUpload: '' };
      case 'UPLOAD_SUCCESS':
        return {
          ...state,
          loadingUpload: false,
          errorUpload: '',
        };
      case 'UPLOAD_FAIL':
        return { ...state, loadingUpload: false, errorUpload: action.payload };
      default:
        return state;
    }
  };

const FormularioTango = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`/api/products/`);
        setProducts(data);
      } catch (err) {
        // toast.error(getError(err));
      }
    }
    fetchProducts();
  }, [])

  // console.log(products)


    const editorRef = useRef();

    const params = useParams(); // /product/:id
    const navigate = useNavigate();
    const { id: productId } = params;
  
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
      loading: true,
      error: ''
    });
  
  
    const [destacado, setDestacado] = useState(false)

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [brand, setBrand] = useState('');
    const [descriptionBreve, setDescriptionBreve] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionGral, setDescriptionGral] = useState('');
    const [descriptionSecundaria, setDescriptionSecundaria] = useState('');
    const [duracion, setDuracion] = useState('');
    const [traslados, setTraslados] = useState('');
    const [comidas, setComidas] = useState('');
    const [seguro, setSeguro] = useState('');
    const [idioma, setIdioma] = useState('');
    const [hospedaje, setHospedaje] = useState('');
    const [entradas, setEntradas] = useState('');
    const [guia, setGuia] = useState('');
    const [infoAdicional, setInfoAdicional] = useState('');
  
    const [payment, setPayment] = useState('');
    const [itinerario, setItinerario] = useState('');
    const [menu, setMenu] = useState('');

    const [servicename, setServicename] = useState('');

    const [nombresubproducto, setNombresubproducto] = useState('')
    const [descripcionsubproducto, setDescripcionsubproducto] = useState('');
    const [info1subproducto, setInfo1subproducto] = useState('');
    const [info2subproducto, setInfo2subproducto] = useState('');
    const [info3subproducto, setInfo3subproducto] = useState('');


    const [stockampliado, setStockampliado] = useState('');
    const [fecha, setFecha] = useState('');
    const stockampliadofiltrado = {stockampliado, fecha};

    const [product, setProduct] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/products/${productId}`);
          setDestacado(data.destacado)
          setName(data.name);
          setSlug(data.slug);
          setPrice(data.price);
          setImage(data.image);
          setImages(data.images);
          // setFechas(data.fechas.map(x =>  parseISO(x, 'yyyy/MM/dd')));
          setFechas(data.fecha);
          setFechaspuntual(data.fechasPuntual);
          setDiasdelasemana(data.diasdelasemana);
          setCategory(data.category);
          setCountInStock(data.countInStock);
          setBrand(data.brand);
          setDescriptionBreve(data.descriptionBreve);
          setDescription(data.description);
          setDescriptionGral(data.descriptionGral);
          setDescriptionSecundaria(data.descriptionSecundaria);
          setDuracion(data.duracion);
          setTraslados(data.traslados);
          setComidas(data.comidas);
          setSeguro(data.seguro);
          setIdioma(data.idioma);
          setHospedaje(data.hospedaje);
          setEntradas(data.entradas);
          setGuia(data.guia);
          setHospedaje(data.hospedaje);
          setInfoAdicional(data.infoAdicional);

          setItinerario(data.tangos.itinerario);
          setMenu(data.tangos.menu)
          setPayment(data.paymentMethodName);

          setServicename(data.tangos.servicename);

          setNombresubproducto(data.subproducto.nombresubproducto);
          setDescripcionsubproducto(data.subproducto.descripcionsubproducto);
          setInfo1subproducto(data.subproducto.info1subproducto);
          setInfo2subproducto(data.subproducto.info2subproducto);
          setInfo3subproducto(data.subproducto.info3subproducto);

          setStockampliado(data.ampliacion.stockampliado);
          setFecha(data.ampliacion.fecha);
          
          dispatch({ type: 'FETCH_SUCCESS' });
        } catch (err) {
          dispatch({
            type: 'FETCH_FAIL',
            payload: getError(err),
          });
        }
      };
      fetchData();
    }, [productId]);



    useEffect(() => {
      const fetchData = async (id) => {
        dispatch({ type: 'FETCH_REQUEST' });
        try {
          const data = await axios.get(`/api/products/${params.id}`);
          setProduct(data.data)
          // console.log(data.data.subproducto)
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }, [params]);

    // console.log(product.subproducto);

  
    const submitHandler = async (e) => {
      e.preventDefault();
      try {
        dispatch({ type: 'UPDATE_REQUEST' });
        await axios.put(
          `/api/products/${productId}`,
          {
            _id: productId,
            destacado,
            name,
            slug,
            price,
            image,
            images,
            fechas,
            fechasPuntual,
            diasdelasemana,
            category,
            brand,
            countInStock,
            descriptionBreve,
            description,
            descriptionGral,
            descriptionSecundaria,
            duracion,
            traslados,
            comidas,
            seguro, 
            idioma,
            hospedaje,
            entradas,
            guia,
            infoAdicional,
            itinerario,
            menu,
            payment,
            servicename,
            subproductofiltrado,
            stockampliadofiltrado
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: 'UPDATE_SUCCESS',
        });
        toast.success('Producto actualizado exitosamente');
        navigate('/admin/products');
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'UPDATE_FAIL' });
      }
    };

  
    const uploadFileHandler = async (e, forImages) => {
      const file = e.target.files[0];
      const bodyFormData = new FormData();
      bodyFormData.append('file', file);
      try {
        dispatch({ type: 'UPLOAD_REQUEST' });
        const { data } = await axios.post('/api/upload', bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'UPLOAD_SUCCESS' });
  
        if (forImages) {
          setImages([...images, data.secure_url]);
        } else {
          setImage(data.secure_url);
        }
        toast.success('Imagen cargada exitosamente. Click en Actualizar para ejecutar los cambios');
        
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      }
    };
  
    const deleteFileHandler = async (fileName, f) => {
      console.log(fileName, f);
      console.log(images);
      console.log(images.filter((x) => x !== fileName));
      setImages(images.filter((x) => x !== fileName));
      toast.success('Imagen eliminada exitosamente. Click en Actualizar para ejecutar los cambios');
    };

     // const fechasFormat = parseISO(fechas[0], 'yyyy/MM/dd');

     // console.log(typeof fechas); 
     const today = new Date();
     const disabledDays = [
       // new Date(agus[0].fechas),
       {before: today}
   ];

   const subproductofiltrado = {nombresubproducto, descripcionsubproducto, info1subproducto, info2subproducto, info3subproducto}
  //  console.log(subproductofiltrado)


    const handleCheck = () => {
      setDestacado(destacado => !destacado);
    }

    const deleteHandler = async (x) => {
      if (window.confirm('Estás seguro de eliminar el subproducto?')) {
        try {
          // dispatch({ type: 'DELETE_REQUEST' });
          await axios.delete(`/api/products/subproducto/${x._id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          navigate('/admin/products')
          // dispatch({ type: 'DELETE_SUCCESS' });
          toast.success('Subproducto eliminado exitosamente');
        } catch (error) {
          toast.error(getError(error));
          // dispatch({
          //   type: 'DELETE_FAIL',
          // });
        }
      }
    };

    const deleteAmpliacionHandler = async (x) => {
      if (window.confirm('Estás seguro de eliminar eliminar esta ampliación de cupo?')) {
        try {
          // dispatch({ type: 'DELETE_REQUEST' });
          await axios.delete(`/api/products/ampliacion/${x._id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          navigate('/admin/products')
          // dispatch({ type: 'DELETE_SUCCESS' });
          toast.success('Ampliacion eliminada exitosamente');
        } catch (error) {
          toast.error(getError(error));
          // dispatch({
          //   type: 'DELETE_FAIL',
          // });
        }
      }
    };

    const editHandler = async (x) => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/products/subproducto/${x._id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          setNombresubproducto(data.data[0].nombresubproducto);
          setDescripcionsubproducto(data.data[0].descripcionsubproducto);
          setInfo1subproducto(data.data[0].info1subproducto);
          setInfo2subproducto(data.data[0].info2subproducto);
          setInfo3subproducto(data.data[0].info3subproducto);
          dispatch({ type: 'FETCH_SUCCESS' });
          // console.log(data.data[0].nombresubproducto);
        } catch (err) {
          dispatch({
            type: 'FETCH_FAIL',
            payload: getError(err),
          });
        } 
    }

    const updateSubProductHandler = async(x) => {
      // e.preventDefault();
      try {
        dispatch({ type: 'UPDATE_REQUEST' });
        const { data } = await axios.put(
          `/api/products/subproducto/${x._id}`,
          { _id: x._id, nombresubproducto, descripcionsubproducto, info1subproducto, info2subproducto, info3subproducto   },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: 'UPDATE_SUCCESS',
        });
        console.log(data);
        toast.success('Subproducto actualizado exitosamente');
        navigate('/admin/products')
        // navigate('/admin/users');
      } catch (error) {
        toast.error(getError(error));
        dispatch({ type: 'UPDATE_FAIL' });
      }
    }

    const footer = <div>
    {fecha ? (
        <div className="contenedor-footer-amplicacion-cupo">
          <p className="texto-fecha-ampliacion-cupo-selected">{(format(fecha, 'EEEE', {locale: es}))} {format(fecha, 'd')} de {format(fecha, 'LLLL', {locale: es})} del {format(fecha, 'u', {locale: es})}</p>
        </div>
    ) : (
      <div className="contenedor-footer-amplicacion-cupo">
          <p className="texto-fecha-ampliacion-cupo">Seleccionar la fecha para ampliar</p>
        </div>
    )}
   
    </div>
  // console.log(product.ampliacion)

  const [fechas, setFechas] = useState([]);
  const [fechasPuntual, setFechaspuntual] = useState([]);
  
  const [diasdelasemana, setDiasdelasemana] = useState({
    lunes: false,
    martes: false
  });
  
          //   console.log(typeof fechas);
  
          //   const today = new Date();
  
          //   const disabledDays = [
          //     fechasPuntual,
          //     {before: today}
          // ];

  const generarDia = (dia) => {
          
    diasdelasemana[dia] = !diasdelasemana[dia]
    setDiasdelasemana({...diasdelasemana})
    setFechas(generarFechas());
  }
  
  const generarFechas = () => {
    const arraySemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const dias = Object.keys(diasdelasemana)
    let fechasAcumuladas = [];
    dias.forEach((dia)=>{
      if(diasdelasemana[dia]) {
        const newFechas = eachWeekOfInterval( {
          start: new Date(2023,0,1),
          end: new Date(2023,11,31)
        }, {weekStartsOn: arraySemana.indexOf(dia)} )
  
        fechasAcumuladas = fechasAcumuladas.concat(newFechas);
      }
    })
    return fechasAcumuladas;
  }


  return (
    <Container>
        <Helmet>
            <title>Edit Product {productId}</title>
        </Helmet>

          <Form className="mb-5" onSubmit={submitHandler}>
        <h1 className='titulo-principal-crear-producto'>Datos Principales {name}</h1>

      <div className="grid-formulario">

      <div className="container bloque-form1">

      <Form.Group>
            {/* <Form.Label className="fs-5">Fecha</Form.Label> */}
              <DayPicker 

                  selected={fechas}
                  onSelect={setFechas}
                  mode="multiple"
                  locale={es}
                  disabled={disabledDays}
                  value={fechas}
                  // footer={footer}
                  />
            
          </Form.Group>

        <Form.Group className="mb-3" controlId="name">
          <Form.Label className="label">Nombre del Producto</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="slug">
          <Form.Label className="label">Subtítulo breve del Producto</Form.Label>
          <Form.Control
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </Form.Group>

        <div className="my-5 fs-3">
              <Form.Check
                  type="checkbox"
                  id="repetir"
                  label="Producto Desctacado"
                  // value={destacado}
                  checked={destacado}
                  onChange={handleCheck}
              />
            </div>

        <Form.Group className="mb-3" controlId="name">
          <Form.Label className="label">Precio</Form.Label>
          <Form.Control
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="image">
          <Form.Label className="label">Imágenes del Producto</Form.Label>
          <Form.Control
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="additionalImage">
          <Form.Label className="label">Imágenes Adicionales</Form.Label>
          {images.length === 0 && <MessageBox>No image</MessageBox>}
          <ListGroup variant="flush">
            {images.map((x) => (
              <ListGroup.Item className="contenedor-imagen-cloudinary" key={x}>
                <div className="imagen-cloudinary">
                  {x}
                </div>
                <Button variant="primary" onClick={() => deleteFileHandler(x)}>
                  <i className="fa fa-times-circle">Borrar</i>
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="imageFile">
          <Form.Label className="label">Imágen de Portada</Form.Label>
          <Form.Control type="file" onChange={uploadFileHandler} />
          {loadingUpload && <LoadingBox></LoadingBox>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="additionalImageFile">
          <Form.Label className="label">Imágenes Adicionales del Producto</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => uploadFileHandler(e, true)}
          />
          {loadingUpload && <LoadingBox></LoadingBox>}
        </Form.Group>
        </div>


        <div className="container bloque-form2">

        <Form.Group className="mb-3" controlId="category">
          <Form.Label className="label">Categoría</Form.Label>
          <Form.Control
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="brand">
          <Form.Label className="label">Brand</Form.Label>
          <Form.Control
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="countInStock">
          <Form.Label className="label"> Confirmación (Ingresando el valor "100", se indica que el producto no requiere confirmación de disponibilidad)</Form.Label>
          <Form.Control
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="descriptionBreve">
            <Form.Label className="label-descripciones">Descripción Breve</Form.Label>
            <Form.Control
              type="text"
              value={descriptionBreve}
              onChange={(e) => setDescriptionBreve(e.target.value)}
              required
            />
      </Form.Group>
      
        <Form.Group className="mb-3" controlId="description">
          <Form.Label className="label">Descripción Corta</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="descriptionGral">
          <Form.Label className="label">Descripción General</Form.Label>
          <Editor
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={descriptionGral}
            // init= {{menubar: false}}
            onEditorChange={(newText) => setDescriptionGral(newText)}
            init={{
              height: 250,
              menubar: true,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="descriptionSecundaria">
          <Form.Label className="label">Descripción Secundaria</Form.Label>
          <Editor
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={descriptionSecundaria}
            // init= {{menubar: false}}
            onEditorChange={(newText) => setDescriptionSecundaria(newText)}
            init={{
              height: 250,
              menubar: true,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
        </Form.Group>

        </div>
        </div>

        <div className="grid-formulario">

        
            <h1 className='deshabilitar-dias-crear-producto'>Deshabilitar días del servicio</h1>

      <div className="grid-fechas-crear-producto">
        
        <div className="grid-dias-semana-deshabilitar">
            <div className="contenedor-check">
                <Form.Check
                    type="checkbox"
                    id="lunes"
                    label="Lunes"
                    checked={!!diasdelasemana.lunes}
                    onChange={(e)=>generarDia("lunes")}
                />
              </div>
              
              <div className="contenedor-check">
                <Form.Check
                    type="checkbox"
                    id="martes"
                    label="Martes"
                    checked={!!diasdelasemana.martes}
                    onChange={(e)=>generarDia("martes")}
                />
              </div>

              <div className="contenedor-check">
                <Form.Check
                    type="checkbox"
                    id="miercoles"
                    label="Miércoles"
                    checked={!!diasdelasemana.miercoles}
                    onChange={(e)=>generarDia("miercoles")}
                />
              </div>

              <div className="contenedor-check">
                <Form.Check
                    type="checkbox"
                    id="jueves"
                    label="Jueves"
                    checked={!!diasdelasemana.jueves}
                    onChange={(e)=>generarDia("jueves")}
                />
              </div>

              <div className="contenedor-check">
                <Form.Check
                    type="checkbox"
                    id="viernes"
                    label="Viernes"
                    checked={!!diasdelasemana.viernes}
                    onChange={(e)=>generarDia("viernes")}
                />
              </div>

              <div className="contenedor-check">
                <Form.Check
                    type="checkbox"
                    id="sabado"
                    label="Sábado"
                    checked={!!diasdelasemana.sabado}
                    onChange={(e)=>generarDia("sabado")}
                />
              </div>

              <div className="contenedor-check">
                <Form.Check
                    type="checkbox"
                    id="domingo"
                    label="Domingo"
                    checked={!!diasdelasemana.domingo}
                    onChange={(e)=>generarDia("domingo")}
                />
              </div>  
        </div>
        </div>

        <div>
          <h1 className='deshabilitar-dias-puntual-crear-producto'>Deshabilitar días puntuales del servicio</h1>

          <div className="contenedor-calendario-crear-producto">
            <Form.Group>
              {/* <Form.Label className="fs-5">Fecha</Form.Label> */}
                <DayPicker 

                    selected={fechas}
                    onSelect={setFechas}
                    mode="multiple"
                    locale={es}
                    disabled={disabledDays}
                    // footer={footer}
                    />
            </Form.Group>
          </div>   
        </div> 
          
        
        <Form.Group className="mb-3" controlId="itinerario">
        <h1 className="titulo-principal-crear-producto">Itinerario</h1>
            <Form.Label className="label">Info con los horarios y detalles de las actividades</Form.Label>
            <Editor
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={itinerario}
              // init= {{menubar: false}}
              onEditorChange={(newText) => setItinerario(newText)}
              init={{
                height: 250,
                menubar: true,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </Form.Group>
        
        <Form.Group className="mb-3" controlId="menu">
        <h1 className="titulo-principal-crear-producto">Menú</h1>
          <Form.Label className="label">Menúes detallados</Form.Label>
          <Editor
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={menu}
            // init= {{menubar: false}}
            onEditorChange={(newText) => setMenu(newText)}
            init={{
              height: 250,
              menubar: true,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
        </Form.Group>

        </div> 

        <div>
            <h1 className="titulo-principal-crear-producto">Información Adicional</h1>
          <Form.Group className="mb-3" controlId="infoAdicional">
            <Form.Label className="label">Información adicional útil del producto</Form.Label>
            <Editor
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={infoAdicional}
              // init= {{menubar: false}}
              onEditorChange={(newText) => setInfoAdicional(newText)}
              init={{
                height: 250,
                menubar: true,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen advcode',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </Form.Group> 
        </div>


        <div className="contenedor-iconos-formulario-tango">
            <h1 className="titulo-principal-crear-producto">Iconos</h1>
            <div className="grid-formulario">
            
            <div className="container bloque-form1">
              <Form.Group className="mb-3" controlId="duracion">
                <Form.Label className="label"><AiOutlineClockCircle className="fs-2 me-2"/> Duración del show</Form.Label>
                  <Form.Control
                    value={duracion}
                    onChange={(e) => setDuracion(e.target.value)}
                    required
                  />
              </Form.Group>
              <Form.Group className="mb-3" controlId="traslados">
                <Form.Label className="label"><AiOutlineCar className="fs-2 me-2"/>Servicio de traslado</Form.Label>
                  <Form.Control
                    value={traslados}
                    onChange={(e) => setTraslados(e.target.value)}
                    required
                  />
              </Form.Group>
              <Form.Group className="mb-3" controlId="comidas">
                <Form.Label className="label"><MdFoodBank className="fs-2 me-2"/>Comidas</Form.Label>
                  <Form.Control
                    value={comidas}
                    onChange={(e) => setComidas(e.target.value)}
                    required
                  />
              </Form.Group>
            </div>

            <div className="container bloque-form2">

              <Form.Group className="mb-3" controlId="seguro">
                  <Form.Label className="label"><MdOutlineLocalHospital className="fs-2 me-2"/>Seguro de viaje</Form.Label>
                    <Form.Control
                      value={seguro}
                      onChange={(e) => setSeguro(e.target.value)}
                      required
                    />
              </Form.Group>
              <Form.Group className="mb-3" controlId="hospedaje">
                  <Form.Label className="label"><BiBed className="fs-2 me-2"/>Hospedaje</Form.Label>
                    <Form.Control
                      value={hospedaje}
                      onChange={(e) => setHospedaje(e.target.value)}
                      required
                    />
              </Form.Group>
            </div>

          </div>
          </div>

        <div className="contenedor-formulario-tango">
            <h1 className="titulo-principal-crear-producto">Servicios disponibles</h1>
            <div>
              <Form.Group className="mb-3" controlId="infoAdicional">
              <Form.Label className="label">Primera</Form.Label>
              <Form.Control
                value={servicename}
                onChange={(e) => setServicename(e.target.value)}
              />
              </Form.Group> 
            </div>
        </div>



      <div className="grid-formulario contenedor-subproducto-form-tango">

      
        <div>
          <h1 className="titulo-principal-crear-subproducto">Crear Subproducto</h1>
          <Form.Group className="mb-4" controlId="nombresubproducto">
          <Form.Label className="label-subproducto">Nombre del Subproducto</Form.Label>
          <Form.Control
            value={nombresubproducto}
            type="text"
            onChange={(e) => setNombresubproducto(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="descripcionsubproducto">
          <Form.Label className="mb-1 fs-5 label-subproducto">Descripción del Servicio Subproducto</Form.Label>
          <Form.Control
          as="textarea"
          rows={3}
          name="descripcionsubproducto"
          value={descripcionsubproducto}
          onChange={(e) => setDescripcionsubproducto(e.target.value)} 
          // required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="info1subproducto">
          <Form.Label className="label-subproducto">Información importante breve 1</Form.Label>
          <Form.Control
            value={info1subproducto}
            type="text"
            onChange={(e) => setInfo1subproducto(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="info2subproducto">
          <Form.Label className="label-subproducto">Información importante breve 2</Form.Label>
          <Form.Control
            value={info2subproducto}
            type="text"
            onChange={(e) => setInfo2subproducto(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="info3subproducto">
          <Form.Label className="label-subproducto">Información importante breve 3</Form.Label>
          <Form.Control
            value={info3subproducto}
            type="text"
            onChange={(e) => setInfo3subproducto(e.target.value)}
          />
        </Form.Group>

        </div>

        <div>
        
        {product.subproducto ? (
          <>
            <h1>Suproductos creados para {name}</h1>
            {product.subproducto.map((x, i) => (
            <div>
              <div className="contenedor-botones-titulo-subproductos">
                <div>
                  <p className="item-subproducto-map"><strong>{x.nombresubproducto}</strong></p>
                  {/* <p>{i}</p> */}
                  <p>{product.subproducto._id}</p>
                </div>
                <div className='contenedor-botones'>
                  <AiFillEdit className="boton-editar" onClick={() => editHandler(x)}/>
                  <Link  to={'/'}><AiFillDelete className="boton-eliminar-formulario" onClick={() => deleteHandler(x)}/></Link>
                </div>
              </div>
              
              <p className="descripcion-subproducto">{x.descripcionsubproducto}</p>
              <strong><p className="info1-subproducto">{x.info1subproducto}</p></strong>
              <p>{x.info2subproducto}</p>
              <strong><p className="info2-subproducto">{x.info3subproducto}</p></strong>
              
           

              <div className="contenedor-boton-actualizar-subproducto">
                <Button className="boton-card-subproducto mt-3" disabled={loadingUpdate} onClick={() => updateSubProductHandler(x)}>Actualizar Subproducto</Button>
              </div>

          </div>
           
          ))}
          
          

          </>
        
        ) : ('Sin subproductos')}

        
        
        </div>

        <div className="grid-panel-ampliacion-cupo">

        <div className="contenedor-formulario-modificar-cupo">

          <h1 className="texto-formulario-modificar-cupo">Ampliar cupo</h1>
            
              <Form.Group className="contenedor-calendario" controlId="fecha">
                      <Form.Label className="subtitulo-formulario-modificar-cupo">
                        Seleccionar la fecha
                      </Form.Label>
                            <DayPicker 
                                // type="date"
                                name="fecha"
                                // value={fecha}
                                selected={fecha}
                                onSelect={setFecha}
                                mode="single"
                                // modifiers={pickerFunction()}
                                // modifiersStyles={stockinicial < 0 ? ({ booked: bookedStyle }) : ({ booked: conStock})}
                                // onDayClick={handleDayClick}
                                locale={es}
                                footer={footer}
                                disabled={disabledDays}
                                // {...register("fecha", { required: true })}
                                // error={!!errors?.fecha}
                                // helperText={errors?.fecha ? errors.fecha.message : null}
                                // onChange={(e) => setFecha(e.target.value)}
                                />
                    </Form.Group>

              
                  <Form.Group className="contenedor-input-ampliacion-cupo" controlId="cupo">
                    <Form.Label className="label-cupo-a-ampliar">
                    Cantidad de cupos a ampliar
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      name="cupo"
                      // value={cupo}
                      onChange={(e) => setStockampliado(e.target.value)}
                      // onClick={(e) => sumarCupos()}
                      // required
                    />
                  </Form.Group>

                {/* <Button className="boton-cupo" variant="primary" onClick={handleCupo}>Actualizar cupo</Button>a */}

          </div>

        </div>
      
     {product.ampliacion ? (
      <>
        <div className="contenedor-formulario-modificar-cupo">
          <h1>Fechas con ampliación de cupo para {name}</h1>
          {product.ampliacion.map((x, i) => (
            <div>
              <div className="contenedor-listado-ampliacion-cupos">
                <div>
                  <div className="contenedor-stockampliado">
                      <p className="texto-cantidad-cupo-label">Día con stock ampliado:</p><strong className="stockampliado-dato-negrita">{x.fecha}</strong>
                      {/* <p>{(format(x.fecha, 'EEEE', {locale: es}))}</p> */}
                      {/* <p>{format(x.fecha, 'dd/mm/yyyy')} </p> */}
                    </div>

                    <div className="contenedor-stockampliado">
                        <p className="texto-cantidad-cupo-label">Cantidad de cupo:</p><strong className="stockampliado-dato-negrita">{x.stockampliado}</strong>
                    </div>
                </div>
                  
                  <div className='contenedor-botones'>
                    {/* <AiFillEdit className="boton-editar" onClick={() => editHandler(x)}/> */}
                    <Link  to={'/'}><AiFillDelete className="boton-eliminar-formulario" onClick={() => deleteAmpliacionHandler(x)}/></Link>
                  </div>
              </div>
              
            </div>
           
          ))}
        </div>
      </>
     ) : ('No hay días ampliados') } 


      </div>


        <div className="mb-3 d-flex justify-content-end">
          <Button className="boton-card mt-3" disabled={loadingUpdate} type="submit">
            Crear
          </Button>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </div>

      </Form>
    
      </Container>
  )
}

export default FormularioTango