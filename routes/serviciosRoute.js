import express from 'express';
import serviciosController from '../controllers/servicios/serviciosController.js';

const router = express.Router();

// Definir la ruta para servicios
router.use('/servicios', serviciosController);

export default router;