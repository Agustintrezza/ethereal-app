import express from "express";
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
// const mg = require('mailgun-js');
import mg from 'mailgun-js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Stripe from 'stripe';

import User from '../backend/models/userModel.js';

import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import notificacionRouter from "./routes/notificacionRoutes.js";
import configuracionRouter from "./routes/configuracionRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=> {
      console.log('Conectado a la base de datos');
    })
    .catch((err) => {
      console.log(err.message);
    })

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
})

app.get('/api/keys/google', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || '');
})

const mailgun = () =>
mg({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const stripe = new Stripe('sk_test_51MpcnREFbtwHkKNRH6otmFgmIxUQR8k0y7gQyJatb71LanFGlJjhJGgt3LdX2i437H32i1DyFe7SJNF6fMgR0KCk00Rm9Rkgqw', {
  apiVersion: '2020-08-27',
});


app.get("/api/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.post('/api/email', (req, res) => {
  // console.log('Entro')
  const {  email, subject, fecha, servicio, phone, nombre, phonepasajero, adultos, menores, hospedaje, habitacion, pago  } = req.body;
  mailgun()
    .messages()
    .send(
      {
        from: 'Ethereal Tours <john@mg.yourdomain.com>',
        to: `${email}`,
        subject: `${subject}`,
        template: '1',
  't:variables': JSON.stringify({ // be sure to stringify your payload
    fecha, email, servicio, phone, nombre, phonepasajero, adultos, menores, hospedaje, habitacion, pago
  }),
  
      },
      (error, body) => {
        if (error) {
          console.log(error);
          res.status(500).send({ message: 'Error in sending email' });
        } else {
          console.log(body);
          res.status(200).send({ message: 'Email enviado correctamente' });
        }
      }
    );
});


app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/notificaciones', notificacionRouter);
app.use('/api/configuraciones', configuracionRouter);
  
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.status(500).send({ message: 'No hay un usuario con ese email registrado' });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    // console.log(token)
    // console.log(secret)
    const link = `http://localhost:3000/reset-password/${oldUser._id}/${token}`;
    // const link = `${token}`
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "agustin.trezza@gmail.com",
        pass: "ikcbclgreimpkbdh",
      },
    });

    var mailOptions = {
      from: "agustin.trezza@gmail.com",
      to: `${email}`,
      subject: "Password Reset and Change",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(200).send({ message: 'Enlace para restablecer la contraseña enviado a la cassilla de correo ingresada' });
    console.log(link);
  } catch (error) {}
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) => 
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message});
});



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
})