import express from 'express';
import pagosController from '../controllers/pagos/pagosController.js';

const router = express.Router();

// Definir la ruta para pagos
router.use('/pagos', pagosController);

export default router;