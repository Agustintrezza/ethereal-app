import React from 'react';
import './WhatsappStyles.css';
import {BsWhatsapp} from 'react-icons/bs';
// import {BiSupport} from 'react-icons/bi';
// import {Link} from 'react-router-dom';

import { motion } from "framer-motion";



const Whastapp = () => {
  return (
    <div>
        <a className='whatsapp' href="https://wa.me/1532368312" target="_blank" rel="noreferrer" >
          <motion.div 
          // drag={"y"} 
          // whileTap={{ cursor: "grabbing" }}
          // dragConstraints={{top: -430, bottom: -10}}
          initial={{scale: 1.2}}
          transition={{ duration: 1}}
          animate= {{scale: 1.1,zIndex: 1, // x:-5, y: -10
          duration: 5
          }}
          className='background-whastapp d-flex align-items-center justify-content-center'>
            <BsWhatsapp/>
            {/* <BiSupport/> */}
          </motion.div>
        </a>
    </div>
  )
}

export default Whastapp