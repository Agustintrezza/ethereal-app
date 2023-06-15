import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { isAuth, isAdmin, generateToken } from "../utils.js";

const userRouter = express.Router();

userRouter.get(
  "/",
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  "/:id",
  isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        favoritos: [...user.favoritos],
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);


userRouter.put(
  "/favoritos",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      const cargarfavorito = user.favoritos.find((x) => x._id === req.body.product._id);

      if (cargarfavorito) {
        // console.log(req.body.product)
        // console.log('Ya existe en la base, se tiene que eliminar');
        const nuevofav = user.favoritos.remove(req.body.product);
        user.favoritos = [...nuevofav];
      } else {
        // console.log('No esta en la base, se tiene que crear');
        user.favoritos = [...user.favoritos, req.body.product ];
      }

      const updatedUser = await user.save();
      res.send({
      favoritos: [...updatedUser.favoritos],
      token: generateToken(updatedUser),
    });

    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);


userRouter.get(
  "/notificaciones",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {

      user.notificaciones = [...user.notificaciones, req.body.notificacion];
      
      const updatedUser = await user.save();
     
      res.send({
      notificaciones: [...updatedUser.notificaciones],
      token: generateToken(updatedUser),
    });

    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.body;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: "User Updated", user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "admin@example.com") {
        //contraseña= "1234567" o "123456"
        res
          .status(400)
          .send({ message: "No es posible eliminar al usuario administrador" });
        return;
      }
      await user.remove();
      res.send({ message: "Usuario eliminado exitosamente",
      token: generateToken(user),
    });
      
    } else {
      res.status(404).send({ message: "No se encontró el usuario" });
    }
  })
);


userRouter.put(
  "/reset/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.password = req.body.password || user.password;

      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        password: updatedUser.password,
        token: generateToken(updatedUser),
      });
      // res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isAdmin: user.isAdmin,
          notificaciones: [...user.notificaciones],
          favoritos: [...user.favoritos],
          token: generateToken(user),
        });
        return;
      } else {
        res.status(401).send({ message: "El password es incorrecto" });
      }
    }
    res.status(401).send({ message: "El email o el password son equivocados" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      notificaciones: ['notificaciones'],
      favoritos: ['favorito'],
      token: generateToken(user),
    });
  })
);

export default userRouter;
