import express from 'express';
import clienteController from '../controllers/clientes/clientesControllers.js'

const router = express.Router();

// Definir la ruta para clientes
router.use('/clientes', clienteController);

export default router;