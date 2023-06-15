import express from "express";
import Product from "../models/productModel.js";
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from "../utils.js";

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
})

productRouter.get('/tipo', async (req, res) => {
    const products = await Product.find();
    let productos = {tango: [], tour: [], paquete: [], varios: []};
    products.map(x => {
      if (x.paymentMethodName == 'Tango') {
        productos.tango = [...productos.tango, x];
      } else if (x.paymentMethodName == 'Tour') {
        productos.tour = [...productos.tour, x];
      } else if (x.paymentMethodName == 'Paquete') {
        productos.paquete = [...productos.paquete, x];
      }
       else {
        productos.varios = [...productos.varios, x];
      }
    });
    res.send(productos);
})

productRouter.get('/destacados', async (req, res) => {
  const products = await Product.find();
  let destacados = [];
  products.map(x => {
    if (x.destacado == true) {
      destacados = [...destacados, x];
    } 
  });
  // console.log(destacados);
  res.send(destacados);
})


productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      destacado: req.body.destacado,
      oferta: req.body.oferta,
      name: 'Nombre de ejemplo ' + Date.now(),
      slug: 'Nombre de ejemplo' + Date.now(),
      image: '/images/p1.jpg',
      images: req.body.images,
      moreimages: req.body.moreimages,
      adultos: req.body.adultos,
      menores: req.body.menores,
      bebes: req.body.bebes,
      price: 0,
      category: 'Categoría de ejemplo',
      brand: 'Brand de ejemplo',
      countInStock: 0,
      stock: 0,
      rating: 0,
      numReviews: 0,
      descriptionBreve: 'Descripción breve de ejemplo',
      description: 'Descripción de ejemplo',
      descriptionGral: 'Descripción general de ejemplo',
      descriptionSecundaria: req.body.descriptionSecundaria,
      traslados: '-',
      comidas: '-',
      entradas: '-',
      guia: '-',
      duracion: '-',
      seguro: '-',
      idioma: '-',
      hospedaje: '-',
      entradas: '-',
      infoAdicional: '-',
      fechas: req.body.fechas,
      itinerario: req.body.itinerario,
      menu: req.body.menu,
      paymentMethodName: req.body.paymentMethodName,
      servicename: req.body.servicename,
      // subproducto: req.body.subproductofiltrado,
      // ampliacion: req.body.stockampliadofiltrado,
    });
    const product = await newProduct.save();
    res.send({ message: '¡Nuevo producto creado!', product });
  })
);

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.destacado = req.body.destacado;
      product.oferta = req.body.oferta;
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.images = req.body.images;
      product.moreimages = req.body.moreimages;
      product.adultos = req.body.adultos;
      product.menores = req.body.menores;
      product.bebes = req.body.bebes;
      // product.fechas = req.body.fechas;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.stock = req.body.stock;
      product.descriptionBreve = req.body.descriptionBreve;
      product.description = req.body.description;
      product.descriptionGral = req.body.descriptionGral;
      product.descriptionSecundaria = req.body.descriptionSecundaria;
      product.traslados = req.body.traslados;
      product.comidas = req.body.comidas;
      product.entradas = req.body.entradas;
      product.guia = req.body.guia;
      product.duracion = req.body.duracion;
      product.seguro = req.body.seguro;
      product.idioma = req.body.idioma;
      product.hospedaje = req.body.hospedaje;
      product.entradas = req.body.entradas;
      product.tangos.itinerario = req.body.itinerario;
      product.tangos.menu = req.body.menu;
      product.tangos.servicename = req.body.servicename;

      product.fechas = req.body.fechas;
      product.fechasPuntual = req.body.fechasPuntual;

      product.diasdelasemana = req.body.diasdelasemana;
      // product.subproducto = [...product.subproducto, req.body.subproductofiltrado];
      // product.ampliacion = [...product.ampliacion, req.body.stockampliadofiltrado]; 
      
      
        if (product.paymentMethodName == 'Tango' || product.paymentMethodName == 'Tour' ) {
           if(Object.keys(req.body.subproductofiltrado).length === 0) {
          // console.log('es un objeto vacío, no hay que grabarlo')
          } else {
            // console.log('el objeto no está vacío, hay que grabarlo')
            product.subproducto = [...product.subproducto, req.body.subproductofiltrado];
          }
        } 

      if(Object.keys(req.body.stockampliadofiltrado).length === 0) {
        // console.log('es un objeto vacío, no hay que grabarlo')
      } else {
        // console.log('el objeto no está vacío, hay que grabarlo')
        product.ampliacion = [...product.ampliacion, req.body.stockampliadofiltrado];
      }

      // if(Object.keys(req.body.subproductofiltrado).length === 0) {
      //   console.log('es un objeto vacío, no hay que grabarlo')
      // } else {
      //   console.log('el objeto no está vacío, hay que grabarlo')
      //   product.subproducto = [...product.subproducto, req.body.subproductofiltrado];
      // }
      
      
      product.infoAdicional = req.body.infoAdicional;
      await product.save();
      res.send({ message: '¡Producto actualizado!' });
    } else {
      res.status(404).send({ message: 'El producto no fue encontrado' });
    }
  })
);


productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: '¡Producto eliminado!' });
    } else {
      res.status(404).send({ message: 'El producto no fue encontrado' });
    }
  })
);

productRouter.delete(
  '/deshabilitar/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    let producto = await Product.findOne({ 'deshabilitar._id' : (req.params.id) });
    // console.log(producto);

    if (producto) {
      let deshabilitaciones = producto.deshabilitar.map((x, i) => {

        if (x._id == req.params.id) {
          const nuevodeshabilitacion = producto.deshabilitar.remove(req.params.id);
          producto.deshabilitar = [...nuevodeshabilitacion];
          // console.log(producto.subproducto)
        } else {
          x   
        }
      })
      await producto.save();

      res.send({ message: '¡Deshabilitación eliminada!'});
    } else {
      res.status(404).send({ message: 'El producto no fue encontrado',
    });
    }
  })
);



productRouter.delete(
  '/ampliacion/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    let producto = await Product.findOne({ 'ampliacion._id' : (req.params.id) });
    // console.log(producto);

    if (producto) {
      let ampliaciones = producto.ampliacion.map((x, i) => {

        if (x._id == req.params.id) {
          const nuevoampliacion = producto.ampliacion.remove(req.params.id);
          producto.ampliacion = [...nuevoampliacion];
          // console.log(producto.subproducto)
        } else {
          x   
        }
      })
      await producto.save();

      res.send({ message: '¡Ampliacion eliminada!'});
    } else {
      res.status(404).send({ message: 'El producto no fue encontrado',
    });
    }
  })
);

productRouter.delete(
  '/subproducto/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    let producto = await Product.findOne({ 'subproducto._id' : (req.params.id) });
    // console.log(producto);

    if (producto) {
      let subproductos = producto.subproducto.map((x, i) => {

        if (x._id == req.params.id) {
          const nuevosubproducto = producto.subproducto.remove(req.params.id);
          producto.subproducto = [...nuevosubproducto];
          // console.log(producto.subproducto)
        } else {
          x   
        }
      })
      await producto.save();

      res.send({ message: '¡Subroducto eliminado!'});
    } else {
      res.status(404).send({ message: 'El producto no fue encontrado',
    });
    }
  })
);

productRouter.get(
  "/subproducto/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    // console.log('Entra')
    let product = await Product.findOne({ 'subproducto._id' : (req.params.id) });
    if (product) {
        let subproductos = product.subproducto.map((x, i) => {
        if (x._id == req.params.id) {
          product.subproducto = [x];
          // console.log('click',product.subproducto)
        } else {
          x   
        }
      })
      res.send({ message: "subproducto actualizado", data: product.subproducto });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

productRouter.put(
  "/subproducto/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    let product = await Product.findOne({ 'subproducto._id' : (req.params.id) });
    if (product) {
      
      product.subproducto.map(async (x, i) => {
        if (x._id == req.params.id) {
          console.log(x);

          x.nombresubproducto = req.body.nombresubproducto || x.nombresubproducto;
          x.descripcionsubproducto = req.body.descripcionsubproducto || x.descripcionsubproducto;
          x.info1subproducto = req.body.info1subproducto || x.info1subproducto;
          x.info2subproducto = req.body.info2subproducto || x.info2subproducto;
          x.info3subproducto = req.body.info3subproducto || x.info3subproducto;

          await product.save()
          // console.log(x);
          console.log(x);
        } else {
          x   
        }
      })

      res.send({ message: "Subproducto actualizado", data: product.subproducto });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);


productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: '¡Enviaste tu comentario, gracias!' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'El producto no fue encontrado' });
    }
  })
);

const PAGE_SIZE = 11;

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const brand = query.brand || '';
    // const price = query.price || '';
    // const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',  
            },
          } 
        : {}

        
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const brandFilter = brand && brand !== 'all' ? { brand } : {};
    // const ratingFilter =
    //   rating && rating !== 'all'
    //     ? {
    //         rating: {
    //           $gte: Number(rating),
    //         },
    //       }
    //     : {};
    // const priceFilter =
    //   price && price !== 'all'
    //     ? {
    //         // 1-50
    //         price: {
    //           $gte: Number(price.split('-')[0]),
    //           $lte: Number(price.split('-')[1]),
    //         },
    //       }
    //     : {};
    // const sortOrder =
    //   order === 'featured'
    //     ? { featured: -1 }
    //     : order === 'lowest'
    //     ? { price: 1 }
    //     : order === 'highest'
    //     ? { price: -1 }
    //     : order === 'toprated'
    //     ? { rating: -1 }
    //     : order === 'newest'
    //     ? { createdAt: -1 }
    //     : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      // ...queryFilter1,
      ...categoryFilter,
      ...brandFilter,
      // ...priceFilter,
      // ...ratingFilter,
    })
      // .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      // ...queryFilter1,
      ...categoryFilter,
      ...brandFilter,
      // ...priceFilter,
      // ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);


productRouter.get(
  '/categories', expressAsyncHandler(async(req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
)
productRouter.get(
  '/brandies', expressAsyncHandler(async(req, res) => {
    const brandies = await Product.find().distinct('brand');
    res.send(brandies);
  })
)

productRouter.get(
  '/ampliacion', expressAsyncHandler(async(req, res) => {
    const ampliacion = await Product.find().distinct('ampliacion');
    // console.log(ampliacion);

    res.send(ampliacion);
  })

)

productRouter.get('/slug/:slug', async (req, res) => {
    const product = await Product.findOne({slug:req.params.slug});
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'El producto no fue encontrado' });
    }
  });

  productRouter.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'El producto no fue encontradooo' });
    }

  });

export default productRouter;