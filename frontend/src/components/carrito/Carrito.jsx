import React, { useContext } from 'react';
import './CarritoStyles.css';
import {AiOutlineShoppingCart} from 'react-icons/ai';
import { Store } from '../../Store';
import Badge from 'react-bootstrap/esm/Badge';
import { Link } from 'react-router-dom';


// import {Link} from 'react-router-dom';


const Carrito = () => {

const { state } = useContext(Store);
const { cart } = state;
// const [color, setColor] = useState(false)

// const changeBackground = () => {
//     if (window.scrollY >= 95) {
//         setColor(true)     
//     } else {
//         setColor(false)
//     }
// }

// window.addEventListener('scroll', changeBackground);

  return (
    <div>
        <div className='cart'>
            <div className='cart-background d-flex align-items-center justify-content-center'>
                {/* <AiOutlineShoppingCart/> */}
                <Link to="/reservas" >
                  {cart.cartItems.length >= 0 && (
                    <div className="d-flex justify-content-center align-items-center">
                        <Badge pill bg="danger" className="notificacion">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                         </Badge>
                    </div>
                    
                  )}
                  <div className="fs-1 me-1 carrito">
                    <AiOutlineShoppingCart className="text-white"/>
                  </div>
                  
                </Link>
            </div>
        </div>
          
    </div>
  )
}

export default Carrito