import express from "express";
import Notificacion from "../models/notificacionModel.js";
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin, generateToken } from "../utils.js";

const notificacionRouter = express.Router();

notificacionRouter.get(
    "/",
    expressAsyncHandler(async (req, res) => {
      const notificacion = await Notificacion.find({});
      res.send(notificacion);
    })
  );

notificacionRouter.post(
    "/crear-notificacion",
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
    
    const newNotificacion = new Notificacion({
        titulo: req.body.titlenot,
        contenidobreve: req.body.contbreve,
        contenidoextenso: req.body.contextenso
    })

    const notificacion = await newNotificacion.save();
        res.send({
        _id: Notificacion._id,
        titulo: req.body.titlenot,
        contenidobreve: req.body.contbreve,
        contenidoextenso: req.body.contextenso,
        token: generateToken(notificacion),
      });
    })
  );

  notificacionRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const notificacion = await Notificacion.findById(req.params.id);
      if (notificacion) {
        await notificacion.remove();
        res.send({ message: 'Notificacion eliminada exitosamente' });
      } else {
        res.status(404).send({ message: 'La notificacion no fue encontrada' });
      }
    })
  );

  notificacionRouter.get(
    "/:id",
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      // console.log('Entra')
      const notificaciones = await Notificacion.findById(req.params.id);
      if(notificaciones) {
        res.send({ message: "datos correctos de la notificacion", data: notificaciones });
      } else {
        res.status(404).send({ message: "User Not Found" });
      }
    })
  );

  notificacionRouter.put(
    "/:id",
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      // const configuracionId = req.params.id;
      const notificacion = await Notificacion.findById(req.params.id);
      if (notificacion) {
      // console.log(notificacion)
      notificacion.titulo = req.body.titlenot;
      notificacion.contenidobreve = req.body.contbreve;
      notificacion.contenidoextenso = req.body.contextenso;

        await notificacion.save();
        res.send({ message: "Notificación actualizada", data: notificacion});
      } else {
        res.status(404).send({ message: "User Not Found" });
      }
    })
  );



export default notificacionRouter;