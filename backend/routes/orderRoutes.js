import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';
import twilio from 'twilio';
// import { format } from "date-fns";
// import {parseISO} from 'date-fns';


import {startOfToday} from 'date-fns';

const orderRouter = express.Router();
const result = startOfToday()

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);


orderRouter.get(
  '/stock/:id',
  expressAsyncHandler(async (req, res) => {
    const productoafiltrar = req.params.id;
    // console.log('idProducto', productoafiltrar )
    let hoy = startOfToday()
    hoy = hoy.toISOString(true);
    // hoy = hoy.substring(0, 10);
    // console.log(req.params.id);

    // let stockDays = await Order.find({"shippingAddress.idservicio" : productoafiltrar, "shippingAddress.fecha" : { $gt : hoy } }, 'shippingAddress.adultos shippingAddress.menores shippingAddress.fecha' )
    // .sort({'shippingAddress.adultos' : -1})


    const stockDays = await Order.aggregate([
      
        
          {
            // $match : { "shippingAddress.fecha" : { $gte: new ISODate( "2022-12-04" )  }, "shippingAddress.idservicio" : productoafiltrar }
            $match : { "shippingAddress.idservicio" : productoafiltrar }
          },
          {
            $group: {
              _id: "$shippingAddress.fecha",
              // _id: "$modificacion.fecha",
              // adultos: { $sum: "$shippingAddress.adultos" },
              // menores: { $sum: "$shippingAddress.menores" },
              // bebes: { $sum: "$shippingAddress.bebes" },

              // pasajeros : { $sum: { $sum: [ "$modificacion.adultos", "$modificacion.menores", "$modificacion.bebes"  ]}},
              pasajeros : { $sum: { $sum: [ "$shippingAddress.cupofinal"]}},
            },
          },

      //     { $sort: { fecha: 1 } },
        ]);
      
      // console.log(stockDays);
      
      res.send(stockDays);
    })
  );

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    // console.log(orders);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    const products = await Product.aggregate([
      {
        $group: {
          _id: null,
          numProducts: { $sum: 1 },
        },
      },
    ]);
    const tangos = await Product.count({ paymentMethodName: "Tango" })
    const tour = await Product.count({ paymentMethodName: "Tour" })
    const paquete = await Product.count({ paymentMethodName: "Paquete" })
    const delivered = await Order.count({isDelivered: "true"})
    const notdelivered = await Order.count({isDelivered: "false"})
    const admin = await User.count({isAdmin: "true"})
    const notadmin = await User.count({isAdmin: "false"})

    res.send({ users, orders, dailyOrders, productCategories, products, tangos, tour, paquete, delivered, notdelivered, admin, notadmin});
  })
);

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const nameService = req.body.shippingAddress.servicio;
    // console.log('cupofinalinicial', req.body.shippingAddress.cupofinal);

    try {
      const productOrder = await Product.findOne({ name: nameService});
      // console.log('productoOrder', productOrder.countInStock);
    
    if(productOrder.countInStock === 100 ) {
      const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        countInStock: req.body.countInStock,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        creacion: req.body.creacion,
        confirm: productOrder.countInStock,
        status: {name: "auto", modified: new Date().toUTCString(), history: [{ name: "auto", modified: new Date().toUTCString(), modifiedBy: 'AUTOMATICO' }]},
        user: req.user._id,
      })
      ;

      const order = await newOrder.save();

      order.confirmacion.isDelivered = false;
      order.shippingAddress.cupofinal = req.body.shippingAddress.cupofinal

      res.status(201).send({ message: 'Nueva orden creada!', order });

    } else {
      const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        countInStock: req.body.countInStock,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        creacion: req.body.creacion,
        confirm: productOrder.countInStock,
        status: {name: "pending", modified: new Date().toUTCString(), history: [{ name: "created", modified: new Date().toUTCString() }]},
        user: req.user._id,
      });
  
      const order = await newOrder.save();
      order.shippingAddress.cupofinal = req.body.shippingAddress.cupofinal;


      res.status(201).send({ message: 'Nueva orden creada!', order });
    }

  } catch (error) {
    console.log(error)
  }  
  })
);

orderRouter.post(
  '/send',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // console.log(req.body.number)
    
    const accountSid = 'AC4765ec692605df2417ebe06eca4f734c'; 
    const authToken = '14099b7822c0a3437844ee916515bfc4'; 
    const client = new twilio(accountSid, authToken);
    const number = req.body.number;
    const message = req.body.message;
    const idOrder = req.body.id_order;
    
  client.messages 
      .create({ 
        body: `${message}`, 
        from: 'whatsapp:+14155238886',       
        to: `whatsapp:${number}`,
       }) 
      .then(message => console.log(message.sid)) 
      .done();

    // console.log('phoneNumber', number,message );

     try {
      const order = await Order.findById(idOrder);
      if (order) {
        order.confirmacion.isDelivered = true;
        await order.save();
        // console.log(order);
        // localStorage.removeItem('cartItems');
        
      } else {
        res.status(404).send({ message: "La orden no fue encontrada" });
      }
    } catch (e) {
      console.log(e);
    }

  res.status(200).json({message: 'Nueva orden creada!', 
       dati:number
});  
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id});
    res.send(orders);
  })
)

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      res.send(order);
      // console.log(order);
    } else {
      res.status(404).send({ message: 'La orden no fue encontrada' });
    }
  })
);

orderRouter.put(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // console.log(req.body.cupototal, req.body.adultos)
    const order = await Order.findById(req.params.id)
    if (order) {
    order.shippingAddress.fullName = req.body.fullName;
    order.shippingAddress.phone = req.body.phone;
    order.shippingAddress.fecha = req.body.fecha;
    order.shippingAddress.contacto_pasajero = req.body.contacto_pasajero;
    order.shippingAddress.adultos = req.body.adultos;
    order.shippingAddress.menores = req.body.menores;
    order.shippingAddress.bebes = req.body.bebes;
    order.shippingAddress.hospedaje = req.body.hospedaje;
    order.shippingAddress.vendedor = req.body.vendedor;
    order.shippingAddress.pago = req.body.pago;
    order.shippingAddress.monedapago = req.body.monedapago;
    order.shippingAddress.montocobrado = req.body.montocobrado;
    order.shippingAddress.comentariopago = req.body.comentariopago;
    order.shippingAddress.comentarios = req.body.comentarios;
    order.shippingAddress.habitacion = req.body.habitacion;

    await order.save();
    res.send({ message: 'Orden actualizada con éxito' });
    } else {
      res.status(404).send({ message: 'La orden no fue encontrada' });
    }
  })
);


orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      // console.log(req.body.fechaConfirmacion)
      order.confirmacion.pdf = req.body.pdf,
      order.confirmacion.pdfs = req.body.pdfs,
      order.confirmacion.comentarioreserva = req.body.comentarioreserva,
      order.confirmacion.fechaConfirmacion = req.body.fechaConfirmacion,

      order.confirmacion.isDelivered = true,
      order.modificacion.isModified = false;
      order.modificacion.isModConfirm = true;  

      // order.modificacion.idModConfirm = true;
      order.cancelacion.isCancel = false;


      order.status.name = "confirmed";
      order.status.modified = new Date().toUTCString();
      order.status.history.push({ name: "confirmed", modified: new Date().toUTCString(), modifiedBy: 'ADMIN' })


      // order.deliveredAt = formattedToday;
      await order.save();
      res.send({ message: 'Orden entregada!' });
    } else {
      res.status(404).send({ message: 'La orden no fue encontrada' });
    }
  })
);

orderRouter.put(
  '/:id/cancelacion',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.cancelacion.porcentaje = req.body.porcentaje,
      order.cancelacion.fechaCancelacion = req.body.fechaCancelacion,
      order.cancelacion.isCancel = true,

      order.status.name = "cancel";
      order.status.modified = new Date().toUTCString();
      order.status.history.push({ name: "cancel", modified: new Date().toUTCString(), modifiedBy: req.user.name  })

      order.confirmacion.isDelivered = false;
      order.modificacion.isModified = false;

      order.shippingAddress.cupofinal = null;

      await order.save();
      res.send({ message: 'Orden cancelada exitósamente' });
    } else {
      res.status(404).send({ message: 'La orden no fue encontrada' });
    }
  })
);


orderRouter.get(
  '/:id/modificacion',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      res.send(order);
      // console.log(order);
    } else {
      res.status(404).send({ message: 'La orden no fue encontrada' });
    }
  })
);


orderRouter.put(
  '/:id/modificacion',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      // console.log(req.user.name)
      // console.log(req.body.countTicket)

      order.modificacion.servicio = req.body.servicio;
      order.modificacion.fecha = req.body.fecha;
      order.modificacion.fullName = req.body.fullName;
      order.modificacion.adultos = req.body.adultos;
      order.modificacion.menores = req.body.menores;
      order.modificacion.bebes = req.body.bebes;
      order.modificacion.hospedaje = req.body.hospedaje;
      order.modificacion.habitacion = req.body.habitacion;
      order.modificacion.vendedor = req.body.vendedor;
      order.modificacion.pago = req.body.pago;
      order.modificacion.monedapago = req.body.monedapago;
      order.modificacion.montocobrado = req.body.montocobrado;
      order.modificacion.comentariopago = req.body.comentariopago;
      order.modificacion.phone = req.body.phone;
      order.modificacion.comentarios = req.body.comentarios;
      order.modificacion.contacto_pasajero = req.body.contacto_pasajero;
      order.modificacion.countModificacion = req.body.countModificacion;


      order.modificacion.isModified = true;
      order.modificacion.fechaModificacion = req.body.fechaModificacion;

      if(order.modificacion.isModified = true) {
        order.modificacion.isModConfirm = false;
      }

      order.status.name = "pending";
      order.status.modified = new Date().toUTCString();
      order.status.history.push({ name: "pending", modified: new Date().toUTCString(), modifiedBy: req.user.name, 
      modifiedticket: {
          fecha: req.body.fecha,
          fullName: req.body.fullName,
          adultos: req.body.adultos,
          menores: req.body.menores,
          bebes: req.body.bebes,
          servicio: req.body.servicio,
          hospedaje: req.body.hospedaje,
          habitacion: req.body.habitacion,
          vendedor: req.body.vendedor,
          pago: req.body.pago,
          monedapago: req.body.monedapago,
          montocobrado: req.body.montocobrado,
          comentariopago: req.body.comentariopago,
          phone: req.body.phone,
          comentarios: req.body.comentarios,
          contacto_pasajero: req.body.contacto_pasajero,
          countTicket: req.body.countModificacion
        }
      })

      const cupofinal = (parseInt(req.body.adultos) + parseInt(req.body.menores) + parseInt(req.body.bebes) );
      order.shippingAddress.cupofinal = cupofinal;
      // console.log(cupofinal)

      await order.save();
      res.send({ message: 'Orden cancelada exitósamente' });
    } else {
      res.status(404).send({ message: 'La orden no fue encontrada' });
    }
  })
);

orderRouter.put(
  '/:id/admin/confirmar-modificacion',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      // console.log(req.body.fullName)

      order.confirmacion.pdf = req.body.pdf,
      order.confirmacion.pdfs = req.body.pdfs,
      order.confirmacion.comentarioreserva = req.body.comentarioreserva,
      order.confirmacion.fechaConfirmacion = req.body.fechaConfirmacion,

      order.modificacion.isModConfirm = true;
      order.confirmacion.isDelivered = true;
      order.modificacion.fechaConfirmModificacion = req.body.fechaConfirmModificacion;

      order.status.name = "confirmed";
      order.status.modified = new Date().toUTCString();
      order.status.history.push({ name: "confirmed", modified: new Date().toUTCString(), modifiedBy: 'ADMIN' })

      await order.save();
      res.send({ message: 'Modificación confirmada exitosamente' });
    } else {
      res.status(404).send({ message: 'No se pudo confirmar la modificación de la reserva' });
    }
  })
);

orderRouter.put(
  '/:id/admin/modificacion',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      // console.log(order.modificacion.isModConfirm)
      // console.log(req.body.modificada)
      order.modificacion.servicio = req.body.servicio;
      order.modificacion.fecha = req.body.fecha;
      order.modificacion.fullName = req.body.fullName;
      order.modificacion.adultos = req.body.adultos;
      order.modificacion.menores = req.body.menores;
      order.modificacion.bebes = req.body.bebes;
      order.modificacion.hospedaje = req.body.hospedaje;
      order.modificacion.habitacion = req.body.habitacion;
      order.modificacion.vendedor = req.body.vendedor;
      order.modificacion.pago = req.body.pago;
      order.modificacion.monedapago = req.body.monedapago;
      order.modificacion.montocobrado = req.body.montocobrado;
      order.modificacion.comentariopago = req.body.comentariopago;
      order.modificacion.phone = req.body.phone;
      order.modificacion.comentarios = req.body.comentarios;
      order.modificacion.contacto_pasajero = req.body.contacto_pasajero;
      order.modificacion.fechaModificacion = req.body.fechaModificacion;

      const cupofinal = (parseInt(req.body.adultos) + parseInt(req.body.menores) + parseInt(req.body.bebes) );

      order.shippingAddress.cupofinal = cupofinal;
      // console.log(cupofinal);


      if(req.body.cancelada === true) {
        order.cancelacion.isCancel = true;
        order.cancelacion.fechaCancelacion = new Date();
        order.status.name = "cancel";
        order.status.modified = new Date().toUTCString();
        order.status.history.push({ name: "cancel", modified: new Date().toUTCString(), modifiedBy: 'ADMIN'})

        order.modificacion.isModified = false;
        order.confirmacion.isDelivered = false;

        order.shippingAddress.cupofinal = null;
      } 

      if(req.body.confirmada === true) {
        order.confirmacion.isDelivered = true;
        order.modificacion.isModConfirm = true;
        order.confirmacion.fechaConfirmacion = new Date();
        order.status.name = "confirmed";
        order.status.modified = new Date().toUTCString();
        order.status.history.push({ name: "confirmed", modified: new Date().toUTCString(), modifiedBy: 'ADMIN'})
        
        order.cancelacion.isCancel = false;
      } 

      if(req.body.modificada === true) {
        order.modificacion.isModified = true;
        order.status.name = "pending";
        order.status.modified = new Date().toUTCString();
        
        // order.status.history.push({ name: "pending", modified: new Date().toUTCString(), modifiedBy: 'ADMIN', 
        // modifiedticket: {
        //   fecha: req.body.fecha,
        //   fullName: req.body.fullName,
        //   adultos: req.body.adultos,
        //   menores: req.body.menores,
        //   bebes: req.body.bebes,
        //   servicio: req.body.servicio,
        //   hospedaje: req.body.hospedaje,
        //   habitacion: req.body.habitacion,
        //   vendedor: req.body.vendedor,
        //   pago: req.body.pago,
        //   monedapago: req.body.monedapago,
        //   montocobrado: req.body.montocobrado,
        //   comentariopago: req.body.comentariopago,
        //   phone: req.body.phone,
        //   comentarios: req.body.comentarios,
        //   contacto_pasajero: req.body.contacto_pasajero
        // } 

        order.status.history.push({ name: "pending", modified: new Date().toUTCString(), modifiedBy: 'ADMIN', 
        modifiedticket: {
          fecha: req.body.fecha,
          fullName: req.body.fullName,
          adultos: req.body.adultos,
          menores: req.body.menores,
          bebes: req.body.bebes,
          servicio: req.body.servicio,
          hospedaje: req.body.hospedaje,
          habitacion: req.body.habitacion,
          vendedor: req.body.vendedor,
          pago: req.body.pago,
          monedapago: req.body.monedapago,
          montocobrado: req.body.montocobrado,
          comentariopago: req.body.comentariopago,
          phone: req.body.phone,
          comentarios: req.body.comentarios,
          contacto_pasajero: req.body.contacto_pasajero
        } 
      })

      // const nombre = order.status.history.pop().modifiedticket.fullName;
      // // console.log(nombre);

      // if(req.body.fullName !== nombre ) {
      //   console.log(nombre)
      //   console.log(req.body.fullName)
      //   console.log('Es igual')
      // }

        order.modificacion.isModConfirm = false;
        order.confirmacion.isDelivered = false;
        order.cancelacion.isCancel = false;
      } else {
        order.modificacion.isModified = false;
      }

      await order.save();
      res.send({ message: 'Orden cancelada exitósamente' });
    } else {
      res.status(404).send({ message: 'La orden no fue encontrada' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updateOrder = await order.save();
      res.send({ message: 'Order Pagada', order: updateOrder });
    } else {
      res.status(404).send({ message: 'La orden no fue encontrada'})
    }
  })
)

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Orden eliminada exitosamente' });
    } else {
      res.status(404).send({ message: 'La orden no fue encontrada' });
    }
  })
);
export default orderRouter;