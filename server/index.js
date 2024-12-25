import express from 'express';
import path from 'path';
import cors from 'cors';
import http from 'http';
import os from "os";
import { nanoid } from 'nanoid';
import { Server } from 'socket.io';
import { rateLimit } from "express-rate-limit";

// Función para obtener la IP local de la red
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  let localIP = '127.0.0.1';  // Valor predeterminado en caso de que no se pueda encontrar la IP

  for (let iface in interfaces) {
    interfaces[iface].forEach((details) => {
      if (details.family === 'IPv4' && !details.internal) {
        localIP = details.address;
      }
    });
  }

  return localIP;
}

// Obtener la IP local
const localIP = getLocalIP();

// Configuración CORS
const corsOptions = {
  origin: import.meta.env.VITE_URL || `http://${localIP}:5173`,  // Usamos la IP local detectada
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions
});

const port = process.env.PORT || 4000;

// Configuración de rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 solicitudes por IP
  message: {
    status: 429,
    message: "Demasiadas solicitudes desde esta IP. Intenta de nuevo más tarde.",
  },
  standardHeaders: true, // Enviar información en los headers `RateLimit-*`
  legacyHeaders: false, // Deshabilitar los headers `X-RateLimit-*`
});

// Aplicar el límite a todas las rutas
app.use(limiter);

// Habilitar CORS para todas las solicitudes HTTP
app.use(cors(corsOptions));

// Middleware para procesar el cuerpo de la solicitud como JSON
app.use(express.json());

const pedidos = [];

class Cliente {
  constructor(id) {
    this.id = id;
    this.name = "";
    this.phone = "";
    this.date = "";
  }

  asignarDatos(name, phone, date) {
    this.name = name;
    this.phone = phone;
    this.date = date;
  }
}

class Producto {
  constructor(id, name, price, image, category, state, quantity = 1) {
    this.id = id; // ID único del producto
    this.name = name; // Nombre del producto
    this.price = price; // Precio del producto
    this.image = image; // URL de la imagen del producto
    this.category = category; // Categoría del producto
    this.state = state; // Estado del producto (disponible, agotado, etc.)
    this.quantity = quantity; // Cantidad del producto en el pedido (por defecto es 1)
  }

  // Método para actualizar el estado del producto
  actualizarEstado(nuevoEstado) {
    this.state = nuevoEstado;
  }

  // Método para actualizar la cantidad del producto
  actualizarCantidad(nuevaCantidad) {
    this.quantity = nuevaCantidad;
  }

  // Método para obtener los detalles del producto, incluyendo la cantidad
  obtenerDetalles() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      image: this.image,
      category: this.category,
      state: this.state,
      quantity: this.quantity, // Incluir la cantidad en los detalles
    };
  }
}

// let contadorPedido = 0;

class Pedido {
  constructor(cliente, productos = []) {
    // this.id = ++contadorPedido;  // Incremetamos el contador con cada nuevo pedido
    this.id = Date.now(); // Usamos el tiempo actual como ID único
    this.cliente = cliente;  // Relacionamos al cliente con este pedido
    this.productos = productos;  // Lista de productos comprados
    this.estado = 'Pendiente';  // El estado inicial del pedido
    this.total = this.calcularTotal(); // Calcular el total del pedido basado en la cantidad de productos
  }

  // Método para agregar productos al pedido
  agregarProducto(producto) {
    // Verificar si el producto ya está en el pedido
    const productoExistente = this.productos.find(p => p.id === producto.id);

    if (productoExistente) {
      // Si el producto ya está en el pedido, simplemente actualizamos la cantidad
      productoExistente.actualizarCantidad(producto.quantity);
    } else {
      // Si el producto no existe, lo agregamos al pedido
      this.productos.push(producto);
    }

    // Actualizamos el total del pedido después de agregar el producto
    this.total = this.calcularTotal();
  }

  // Método para calcular el total del pedido teniendo en cuenta la cantidad de cada producto
  calcularTotal() {
    return this.productos.reduce((total, producto) => total + (producto.price * producto.quantity), 0);
  }

  // Método para obtener los detalles del pedido
  obtenerDetalles() {
    return {
      id: this.id,
      cliente: this.cliente,
      productos: this.productos.map(producto => producto.obtenerDetalles()),
      estado: this.estado,
      total: this.total, // Total calculado teniendo en cuenta la cantidad
    };
  }

  // Método para actualizar el estado del pedido
  actualizarEstado(nuevoEstado) {
    this.estado = nuevoEstado; // "Pendiente", "Confirmada", "Cancelada" o "Completada"
  }
}

// Middleware para registrar solicitudes entrantes
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next(); // Continuar con el procesamiento de la solicitud
});

// Sirve archivos estáticos desde la carpeta build de Vite
app.use(express.static(path.resolve('dist')));

// Endpoint para obtener todos los pedidos (GET)
app.get('/api/pedidos', (req, res) => {
  console.log('Llamada a /api/pedidos');
  res.status(200).json(pedidos);
});

// Ruta para crear ID de cliente
app.get('/api/new', (req, res) => {
  const id = nanoid();
  const cliente = new Cliente(id);
  const pedido = new Pedido(cliente);
  pedidos.push(pedido);
  console.log('Llamada a /api/new');
  res.json({ id });
});

const pedidosEmitidos = new Set();

// Ruta para actualizar datos del cliente y pedido
app.post('/api/:clienteId', (req, res) => {
  const clienteId = req.params.clienteId || '';
  const nuevoPedido = req.body;
  const date = new Date().toISOString();

  // Validación básica
  if (!nuevoPedido.cliente.name || !nuevoPedido.cliente.phone) {
    return res.status(400).json({ error: 'El nombre y teléfono son requeridos.' });
  }

  if (!nuevoPedido.productos || nuevoPedido.productos.length === 0) {
    return res.status(400).json({ error: 'La orden debe contener al menos un producto.' });
  }

  if (!nuevoPedido.estado) {
    return res.status(400).json({ error: 'El estado del pedido es requerido.' });
  }

  try {
    // Verificar si ya existe un pedido para el cliente
    const pedidoIndex = pedidos.findIndex((pedido) => clienteId === pedido.cliente.id);

    // Si el cliente ya tiene un pedido, actualizamos la información
    if (pedidoIndex >= 0) {
      pedidos[pedidoIndex].cliente.asignarDatos(nuevoPedido.cliente.name, nuevoPedido.cliente.phone, date);

      // Añadir productos al pedido sin duplicarlos
      nuevoPedido.productos.forEach((producto) => {
        // Crear instancia de Producto con la cantidad especificada
        const productoNuevo = new Producto(
          producto.id,
          producto.name,
          producto.price,
          producto.image,
          producto.category,
          producto.state,
          producto.quantity // Asegurarse de que quantity se pasa correctamente
        );

        // Agregar el producto al pedido
        pedidos[pedidoIndex].agregarProducto(productoNuevo);
      });

    } else {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }

    // Emitir solo si el pedido no ha sido emitido antes
    if (!pedidosEmitidos.has(pedidos[pedidoIndex ? pedidoIndex : pedidos.length - 1].id)) {
      io.emit('nuevo-pedido', pedidos[pedidoIndex ? pedidoIndex : pedidos.length - 1]);
      pedidosEmitidos.add(pedidos[pedidoIndex ? pedidoIndex : pedidos.length - 1].id); // Marcar como emitido
    }

    console.log('Llamada a /api/:clienteId');
    res.status(201).json({
      message: 'Reserva confirmada.',
      reservation: clienteId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un problema procesando tu pedido. Intenta más tarde.' });
  }
});

// Ruta para validar una reserva existente a partir del id del cliente
app.get('/api/validar-reserva/:clienteId', (req, res) => {
  const clienteId = req.params.clienteId;

  // Buscar el pedido del cliente por el ID
  const pedidoEncontrado = pedidos.find(pedido => pedido.cliente.id === clienteId);

  // Si no se encuentra el pedido, respondemos con un error
  if (!pedidoEncontrado) {
    return res.status(404).json({ error: 'No se encontró una reserva asociada a este cliente.' });
  }

  // Si se encuentra, respondemos con los detalles del pedido
  const pedidoDetalles = pedidoEncontrado.obtenerDetalles();

  console.log(`Llamada a /api/validar-reserva/${clienteId}`);
  res.status(200).json({
    message: 'Reserva encontrada.',
    pedido: pedidoDetalles,
  });
});

// En producción, redirige todas las rutas a tu frontend React
app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist', 'index.html'));
});

// Configuración de WebSocket (Socket.io)
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
  socket.on('error', (err) => {
    console.error(`Error en el socket: ${err.message}`);
  });
});

// Inicia el servidor
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
