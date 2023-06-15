import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { toast } from 'react-hot-toast';
import { getError } from '../../utils';
import './CotizadorStyles.css';
import Flag from 'react-world-flags'

const Cotizador = () => {

    const [cotizaciones, setCotizaciones] = useState([]);

    useEffect(() => {
        const tipoDeCambio = async () => {
          try {
            const { data } = await axios.get(`https://www.dolarsi.com/api/api.php?type=cotizador`);
            console.log(data);
            setCotizaciones(data);
            // setProducts([data.tango, data.tour, data.paquete, data.varios]);
            // setFavoritos(data)
          } catch (err) {
            toast.error(getError(err));
          }
        }
        tipoDeCambio();
      }, [])

      console.log(cotizaciones);

  return (
    <div className="container">
        <h1>Cotización de Monedas</h1>
        <table className="table table-hover">
            <thead>
                <tr className="fs-5 text-center">
                    <th className="nombre-tabla-head"></th>
                    <th className="nombre-tabla-head">COMPRA</th>
                    <th className="nombre-tabla-head">VENTA</th>
                    {/* <th className="nombre-tabla-head">Euro</th>
                    <th className="nombre-tabla-head">Real</th>
                    <th className="nombre-tabla-head">Libra</th>
                    <th className="nombre-tabla-head">Peso Uruguayo</th> */}
                    {/* <th className="nombre-tabla-head"></th> */}
                </tr>
            </thead>
            <tbody>
                
                <tr className="fs-6">
                    <th><Flag code="USA" height="15" className="bandera"></Flag>Dólar</th>
                    {cotizaciones.map((cotizacion, i) =>(
                    <>  
                        <tr>{cotizacion.casa.nombre}</tr>  
                        <td key={i} className="text-center">{cotizacion.casa.compra}</td>
                        <td className="text-center">{cotizacion.casa.venta}</td>
                    </>
                    ))}
                </tr>
                
            </tbody>
        </table>
        
        <iframe className="" width="300px" height="690px" src="https://www.dolarsi.com/func/moduloArriba-n.html" frameBorder="0" scrolling="0" allowFullScreen=""></iframe>
    </div>
  )
}

export default Cotizador