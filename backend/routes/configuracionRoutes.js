import express from "express";
import Configuracion from "../models/configuracionModel.js";
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin, generateToken } from "../utils.js";

const configuracionRouter = express.Router();

configuracionRouter.get(
    "/",
    expressAsyncHandler(async (req, res) => {
      const configuracion = await Configuracion.find({});
      res.send(configuracion);
    })
  );

  configuracionRouter.post(
    "/configuracion-horarios",
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
    // console.log(req.body.horarios)
    const newConfiguracion = new Configuracion({
        horaReserva: req.body.horarioReservas,
        horaTango: req.body.horarioTango,
    })

    const configuracion = await newConfiguracion.save();
        res.send({
        horaReserva: req.body.horarioReservas,
        horaTango: req.body.horarioTango,
        token: generateToken(configuracion),
      });
    })
  );

  configuracionRouter.put(
    "/configuracion-horarios/:id",
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const configuracionId = req.params.id;
      const configuracion = await Configuracion.findById(req.params.id);
      if (configuracion) {
      // console.log(req.body.horarios)
      configuracion.horaReserva = req.body.horarioReservas;
      configuracion.horaTango = req.body.horarioTango;

        await configuracion.save();
        res.send({ message: "Subproducto actualizadoo"});
      } else {
        res.status(404).send({ message: "User Not Found" });
      }
    })
  );

  


export default configuracionRouter;