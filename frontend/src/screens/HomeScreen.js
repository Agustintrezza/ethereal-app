import React from 'react';
import '../App.css';
// import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
// import Container from 'react-bootstrap/Container';

//COMPONENTS//
// import Header from '../components/header/Header.jsx';
import NavLogos from '../components/navegacion-logos/NavLogos.jsx';
// import Carousel1 from './components/carousel-principal/Carousel1';
// import Galeria from '../components/galeria-slider/Galeria.jsx';
// import Banner from './components/banner/Banner';
import Cards from '../components/cards/Cards.jsx';
// import Formulariofiltro from '../components/formulario-filtro/Formulariofiltro.jsx';
// import Footer from '../components/footer/Footer.jsx';
// import Newletter from '../components/newletter/Newletter.jsx';
// import Galerias from '../components/galeria/Galerias.jsx';
// import Menu from '../components/menu/Menu.jsx';

// import Botonera from '../components/botonera/Botonera.jsx';
// import Chatbot from '../components/chatbot/Chatbot.jsx';
import Whatsapp from '../components/whatsapp/Whatsapp.jsx';
import Carouselboot from '../components/carouselboot/Carouselboot.jsx';
// import Bannercarousel from '../components/banner-carousel/Bannercarousel.jsx';
// import Etiquetasinfo from '../components/etiquetasinfo/Etiquetasinfo.jsx';
import Productos from '../components/productos/Productos';
import Progress from '../components/progress/Progress';
import Faq from '../components/faq/Faq';
// import Cotizador from '../components/cotizador/Cotizador';
import SliderProductosDestacados from '../components/slider-productos-destacados/SliderProductosDestacados';



export default function HomeScreen() {

  //   const [chatbot, setChatbot] = useState(false);

  // const toggleChatbot = () => {
  //   console.log('se disparo');
  //   chatbot ? setChatbot(false) : setChatbot(true);
  // };


  return (
    <div className="App" id='App' >
      {/* <Header/> */}
      {/* <Chatbot chatbot={chatbot} toggleChatbot={toggleChatbot}/>
      <Botonera toggleChatbot={toggleChatbot}/>  */}
      {/* <hr></hr> */}
      <NavLogos/>
      {/* <hr></hr> */}
      <Carouselboot/>
      {/* <Carousel1/> */}
      {/* <Menu/> */}
      <Productos/>
      {/* <Bannercarousel/>   */}
      {/* <Etiquetasinfo/> */}
      {/* <Formulariofiltro/> */}
      <Progress />
      {/* <Cotizador/> */}
      <Cards/>
      <Faq/>
      <SliderProductosDestacados/>
      
      
      
      
      {/* <Galerias/> */}
      {/* <Banner/> */}
      {/* <Galeria/> */}
      {/* <Newletter/> */}
      {/* <Footer/> */}
      <Whatsapp/>
    </div>
  )
}
