import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      comment: { type: String, required: true },
      rating: { type: Number, required: true },
    },
    {
      timestamps: true,
    }
  );

const productSchema = new mongoose.Schema(

    {   
        destacado: { type: Boolean, default: false },
        oferta: { type: Boolean, default: false },
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        image: { type: String, required: false },
        images: [String],
        moreimages: [String],
        adultos: { type: String, required: false },
        menores: { type: String, required: false },
        bebes: { type: String, required: false },
        brand: { type: String, required: true },
        category: { type: String, required: true },
        descriptionBreve: { type: String, required: true },
        description: { type: String, required: true },
        descriptionGral: { type: String, required: true },
        descriptionSecundaria: { type: String, required: false },
        duracion: { type: String, required: false },
        traslados: { type: String, required: false },
        comidas: { type: String, required: false },
        seguro: { type: String, required: false },
        idioma: {type: String, required: false},        
        hospedaje: { type: String, required: false },
        guia: { type: String, required: false },
        entradas: { type: String, required: false },
        infoAdicional: { type: String, required: false},
        price: { type: Number, required: false },
        countInStock: { type: Number, required: true },
        stock: { type: Number, required: false },
        rating: { type: Number, required: false },
        numReviews: { type: Number, required: false },
        reviews: [reviewSchema],
        paymentMethodName: { type: String, required: false },

        tangos: {
          itinerario: { type: String, required: false },
          menu: { type: String, required: false },
          servicename : { type: String, required: false},
        },

        fechas : [
            Date
        ],
        fechasPuntual : [
          Date
        ],

        diasdelasemana: {
          domingo: {type: Boolean, default: false},
          lunes: {type: Boolean, default: false},
          martes: {type: Boolean, default: false},
          miercoles: {type: Boolean, default: false},
          jueves: {type: Boolean, default: false},
          viernes: {type: Boolean, default: false},
          sabado: {type: Boolean, default: false},
        },

        subproducto : [
          {
            nombresubproducto: { type: String, required: false },
            descripcionsubproducto: { type: String, required: false },
            info1subproducto: { type: String, required: false },
            info2subproducto: { type: String, required: false },
            info3subproducto: { type: String, required: false },
          }
        ],
        ampliacion : [
          {
            fecha: {type: Date, required: false},
            stockampliado: { type: Number, required: false },
            servicio: {type: String, required: false}
          }
        ],     

    }, 
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;