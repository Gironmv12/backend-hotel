import express from 'express';
import camasController from '../controllers/camas/camasController.js';

const router = express.Router();

//definir la ruta para tipos de camas
router.use('/camas', camasController);


export default router;