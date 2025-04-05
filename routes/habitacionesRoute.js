import express from 'express';
import habitacionesController from '../controllers/habitaciones/habitacionesControllers.js';

const router = express.Router();

// Definir la ruta para habitaciones
router.use('/habitaciones', habitacionesController);

export default router;