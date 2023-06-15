import mongoose from 'mongoose';

const notificacioneSchema = new mongoose.Schema(

    {
        titulo: {type: String, required: false},
        contenidobreve: {type: String, required: false},
        contenidoextenso: {type: String, required: false},
    },      

    {
        timestamps: true,
    }
);

const Notificacion = mongoose.model('Notificacion', notificacioneSchema);

export default Notificacion;