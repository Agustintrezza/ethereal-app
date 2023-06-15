import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        paymentMethodName: { type: String, required: false },
        countInStock: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      fecha: { type: Date, required: false},
      fullName: { type: String, required: true },
      adultos: { type: Number, required:true },
      menores: { type: Number, required:false },
      bebes: { type: Number, required:false },
      cupofinal: { type: Number, required:false },
      servicio: { type: String, required:true },
      idservicio: { type: String, required:true },
      hospedaje: { type: String, required:true },
      habitacion: { type: String, required:false},
      vendedor: { type: String, required:true },
      pago: { type: String, required: false },
      monedapago: { type: String, required:false },
      montocobrado: { type: String, required:false },
      comentariopago: { type: String, required:false },
      phone: { type: String, required: true },
      comentarios: { type: String, required: false },
      contacto_pasajero: { type: String, required: true },
      servselectfiltro: {type: String, required: false}
    },
    paymentMethod: { type: String, required: false },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    confirm: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: String },
    creacion: { type: Date, required: false},

    confirmacion: {
      isDelivered: { type: Boolean, default: false },
      pdf: { type: String, required: false },
      pdfs: [String],
      comentarioreserva: {type: String, required: false},
      fechaConfirmacion: {type: Date, default: Date.now},
    },

    cancelacion: {
      porcentaje: {type: Number},
      fechaCancelacion: {type: Date},
      isCancel: {type: Boolean, default: false},
    },

    modificacion: {
      isModified: {type: Boolean, default: false},
      fechaModificacion: {type: Date},
      isModConfirm: {type: Boolean, default: false},
      fechaConfirmModificacion: {type: Date},
      countModificacion : {type: Number, default: 0},

      fecha: { type: Date, required: false},
      fullName: { type: String, required: false },
      adultos: { type: Number, required:false },
      menores: { type: Number, required:false },
      bebes: { type: Number, required:false },
      servicio: { type: String, required:false },
      hospedaje: { type: String, required:false },
      habitacion: { type: String, required:false},
      vendedor: { type: String, required:false },
      pago: { type: String, required: false },
      monedapago: { type: String, required:false },
      montocobrado: { type: String, required:false },
      comentariopago: { type: String, required:false },
      phone: { type: String, required: false },
      comentarios: { type: String, required: false },
      contacto_pasajero: { type: String, required: false },
    },

    status: {
      name: {type: String, required: false},
      modified: {type: Date, required: false},
      nombre: { type: String, required: false },
      history: [{
        name: {type: String, required: false},
        modified: {type: Date, required: false},
        modifiedBy: {type: String, required: false},

        modifiedticket: {
          fecha: { type: Date, required: false},
          fullName: { type: String, required: false },
          adultos: { type: Number, required:false },
          menores: { type: Number, required:false },
          bebes: { type: Number, required:false },
          servicio: { type: String, required:false },
          hospedaje: { type: String, required:false },
          habitacion: { type: String, required:false},
          vendedor: { type: String, required:false },
          pago: { type: String, required: false },
          monedapago: { type: String, required:false },
          montocobrado: { type: String, required:false },
          comentariopago: { type: String, required:false },
          phone: { type: String, required: false },
          comentarios: { type: String, required: false },
          contacto_pasajero: { type: String, required: false },
          countTicket : {type: Number, default: 0},
        },

        camposModificados: {
          fecha: { type: Date, required: false},
          fullName: { type: String, required: false },
          adultos: { type: Number, required:false },
          menores: { type: Number, required:false },
          bebes: { type: Number, required:false },
          servicio: { type: String, required:false },
          hospedaje: { type: String, required:false },
          habitacion: { type: String, required:false},
          vendedor: { type: String, required:false },
          pago: { type: String, required: false },
          monedapago: { type: String, required:false },
          montocobrado: { type: String, required:false },
          comentariopago: { type: String, required:false },
          phone: { type: String, required: false },
          comentarios: { type: String, required: false },
          contacto_pasajero: { type: String, required: false },
          countTicket : {type: Number, default: 0},
        },

      }],

    }

  },
  {
    timestamps: true,
  }
);


const Order = mongoose.model('Order', orderSchema);
export default Order;