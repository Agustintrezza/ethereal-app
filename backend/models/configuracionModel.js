import mongoose from 'mongoose';

const configuracionSchema = new mongoose.Schema(

    {   
        horaReserva: {type: String, required: false}, 
        horaTango: {type: String, required: false},
    },      

    {
        timestamps: true,
    }
)

const Configuracion = mongoose.model('Configuracion', configuracionSchema);

export default Configuracion;