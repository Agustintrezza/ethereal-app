import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
// import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import AllProduct from "";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
// import SearchBox from "../components/SearchBox";

import { toast } from 'react-toastify';
import { getError } from '../utils';
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";
import Product from "../components/Allproduct";
import {AiFillCloseCircle} from 'react-icons/ai';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading:false, error: action.payload };
      default:
        return state;
  }
}


function AllProducts() {
  
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  let category = sp.get('category') || 'all';
  const brand = sp.get('brand') || '';
  const query = sp.get('query') || 'all';
  // const price = sp.get('price') || 'all';
  // const rating = sp.get('rating') || 'all';
  // const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
  useReducer(reducer, {
    loading: true,
    error: '',
  });
    // const [productos, setProductos] = useState([]);

    // // const [productos, setProductos] = useState([]);

    // useEffect(() => {
    //   const fetchData = async () => {
    //     dispatch({type: 'FETCH_REQUEST'})
    //     try {
    //       const result = await axios.get('/api/products');
    //       dispatch({type:'FETCH_SUCCESS', payload: result.data})
    //     } catch(err) {
    //       dispatch({type: 'FETCH_FAIL', payload: err.message});
    //     }
    //     // setProductos(result.data);


    //   }
    //   fetchData();
    // }, []);

    

    useEffect(() => {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(
            `/api/products/search?page=${page}&query=${query}&category=${category}`
          );
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
          dispatch({
            type: 'FETCH_FAIL',
            payload: getError(error),
          });
        }
      };
      fetchData();
    }, [category, error, page, query]);
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(
            `/api/products/search?page=${page}&query=${query}&brand=${brand}`
          );
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
          dispatch({
            type: 'FETCH_FAIL',
            payload: getError(error),
          });
        }
      };
      fetchData();
    }, [brand, error, page, query]);

    // console.log(products)

   

    const [categories, setCategories] = useState([]);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const { data } = await axios.get(`/api/products/categories`);
          setCategories(data);
        } catch (err) {
          toast.error(getError(err));
        }
      };
      fetchCategories();
    }, [dispatch]);

    const [brandies, setBrandies] = useState([]);

    useEffect(() => {
      const fetchBrandies = async () => {
        try {
          const { data } = await axios.get(`/api/products/brandies`);
          setBrandies(data);
        } catch (err) {
          toast.error(getError(err));
        }
      };
      fetchBrandies();
    }, [dispatch]);

    // console.log(brandies);
    

    const [switchBrandFilter, setSwitchBrandFilter] = useState(false)
    const [switchCategoryFilter, setSwitchCategoryFilter] = useState(false)

    console.log('brand',switchBrandFilter)
    console.log('category',switchCategoryFilter)
    
    // setSwitchFilter(prevFilter => !prevFilter);
    // console.log(switchFilter)

    const seleccionarEtiqueta = () => {
      setSwitchBrandFilter(true)
      setSwitchCategoryFilter(false)
      // setSwitchBrandFilter(prevCheck => !prevCheck)
      // setSwitchCategoryFilter(prevCheck => !prevCheck)
      // setSwitchCategoryFilter(false)
      console.log('brand',switchBrandFilter)
      console.log('category',switchCategoryFilter)
    }

    const seleccionarCategoria = () => {
      setSwitchBrandFilter(false)
      setSwitchCategoryFilter(true)
      console.log('brand',switchBrandFilter)
      console.log('category',switchCategoryFilter)
    }

    const getFilterUrl = (filter) => {
      const filterPage = filter.page || page;
      const filterCategory = filter.category || category;
      const filterBrand = filter.brand || brand;
      const filterQuery = filter.query || query;

      // setSwitchFilter(true)
      // const filterRating = filter.rating || rating;
      // const filterPrice = filter.price || price;
      // const sortOrder = filter.order || order;
      
      return `/search?category=${filterCategory}&brand=${filterBrand}&query=${filterQuery}&page=${filterPage}`;
      
    };

    // console.log(products)


    return <div> 
    
    <Helmet>
      <title>Ethereal</title>
    </Helmet>
    
    {/* <div className="container d-flex justify-content-between align-items-center">
        <h1 className="container titulo-principal-all-products">¡Todos los productos!</h1>
        {/* <SearchBox className="d-none"/> */}
    {/* </div> */}

    <div className="products container">

    {loading? <LoadingBox/>
    :
    error? <MessageBox variant="danger">{error}</MessageBox>
    :
    <Row className="contenedor-all-products">
      <Col md={2} className="mt-1">
        <h3 className="titulo-categorias-all-products">Categorías</h3>
        <div>
            <ul className="listado-categorias">
              <li className="link-categorias-all-products">
                <Link
                  className={'all' === category ? 'cat-active' : '.cat-comun'}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Todos
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c} className="link-categorias-all-products">
                  <Link
                    className={c   === category ? 'text-bold' : ''}
                    to={getFilterUrl({ category: c })}
                    onClick={seleccionarCategoria}
                  >
                    {c}
                  </Link>
                </li>
              ))}
              </ul>

            <h3 className="titulo-etiquetas-all-products">Etiquetas</h3>
            
            <ul className="listado-etiquetas">
              {brandies.map((c) => (
                <li key={c} className="link-categorias-all-products">
                  <Link
                    className={c === brand ? 'text-bold etiqueta' : 'etiqueta'}
                    to={getFilterUrl({ brand: c })}
                    // onClick={()=>setSwitchBrandFilter(prevFilter => !prevFilter)}
                    onClick={seleccionarEtiqueta}
                  >
                    {c}
                  </Link>
                </li>
              ))}
              </ul>

          </div>
          {/* <div>

        <h3 className="titulo-categorias-all-products">Brands</h3>
        <div>
            <ul>
              <li className="link-categorias-all-products">
                <Link
                  className={'all' === category ? 'cat-active' : '.cat-comun'}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Todos
                </Link>
              </li>
              {brandies.map((b) => (
                <li key={b} className="link-categorias-all-products">
                  <Link
                    className={b === brand ? 'text-bold' : ''}
                    to={getFilterUrl({ brand: b })}
                  >
                    {b}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
      </div> */}
      </Col>
      

      <Col md={10}> 
      {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <div className="resultados-all-products">
                    {/* {countProducts === 0 ? 'No hay resultados  ' : countProducts === 1 ? 'Resultado  ' : countProducts > 1 ? `${countProducts} resultados` : countProducts} */}

                    {countProducts === 0 && 'No hay resultados para la búsqueda'}
                    {countProducts === 1 && 'Resultado único para'}
                    {countProducts > 1 && `${countProducts} resultados`}
                    {switchCategoryFilter && ' : ' + category}
                    {switchBrandFilter && ' : ' + `${brand}`}    
                    {/* {query !== 'all' && ' : ' | + `"${query}"`} */}
                    {/* {brand !== 'all' && ' : ' + brand} */}
                    {/* {category !== 'all' && ' : ' + category} */}
                    {query !== 'all' ||
                    category !== 'all' || brand !== 'all' ? (
                      <Button
                        className="boton-eliminar-busqueda-all-products"
                        // className={'all' === category & brand === 'all' && 'boton-hover'}
                        onClick={() => navigate('/search')}
                        variant="light"
                      >
                        <AiFillCloseCircle className="icono-cerrar-all-products"/>
                      </Button>
                    ) : ('-')}

                    

              </div>

              <Row>
                {countProducts === 0 && (<MessageBox variant="info">No hay resultado para la búsqueda: "{query}"</MessageBox>) }
                {products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>
              

              <div className="contenedor-paginacion">
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <div className="contenedor-paginacion">
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold pagina' : 'pagina'}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                    </div>
                  </LinkContainer>
                ))}
              </div>  
            </> )}
      </Col>
    </Row>
    
    }
    </div>


    </div>
}

export default AllProducts;