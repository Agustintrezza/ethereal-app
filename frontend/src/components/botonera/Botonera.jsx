import React from 'react';
// import {Link} from 'react-router-dom';
import './BotoneraStyles.css';
// import {Link} from 'react-router-dom';
import {AiOutlineArrowUp} from 'react-icons/ai';
// import {BsChatLeftDots} from 'react-icons/bs';
import { HashLink as Link } from 'react-router-hash-link';

import {motion} from 'framer-motion';


const Botonera = (props) => {
  // const [switchToggled, setSwitchToggled] = useState(false);

  // const ToggleSwitch = () => {
  //   switchToggled ? setSwitchToggled(false) : setSwitchToggled(true);
  //   console.log(switchToggled);
  //   props.toogleTheme()
  // };

  return (
    <div>
        <motion.div 
        // drag={"y"} 
        // whileTap={{ cursor: "grabbing" }}
        // dragConstraints={{top: -430, bottom: -10}}
        initial={{scale: 1}}
        transition={{ duration: 1}}
        animate= {{scale: 1.1,zIndex: 1, // x:-5, y: -10
        duration: 5
        }}
            
          className="botonera">
                    {/* <svg
                        id="luna"
                        onClick={ToggleSwitch}
                        className={switchToggled ? "fa-sun" : "fa-moon"}
                    ></svg> */}
            
                    <Link className="logos" to="#App" >
                    <AiOutlineArrowUp className="icono-flecha"/>
                    </Link>
          
                    {/* <div className="logos" onClick={props.toggleChatbot}>
                    <BsChatLeftDots />
                    </div> */}
               
        </motion.div>
    </div>
  )
}

export default Botonera