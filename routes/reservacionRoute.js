import express from 'express';
import reservacionController from '../controllers/reservacion/reservacionController.js';

const router = express.Router();

// Definir la ruta para reservaciones
router.use('/reservaciones', reservacionController);

export default router;