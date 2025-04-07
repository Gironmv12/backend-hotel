import express from 'express';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';
import { body, validationResult } from 'express-validator';

const models = initModels(sequelize);
const { pagos } = models;

const pago = express.Router();

//registrar pago
pago.post('/registrar-pago',[
    body('no_reserva').notEmpty().withMessage('El número de reserva es requerido'),
    body('metodo_pago').notEmpty().isIn(['Efectivo','Tarjeta de crédito','Transferencia']).withMessage('Método de pago no válido'),
    body('monto').notEmpty().isFloat().withMessage('El monto es requerido y debe ser un número'),
    body('estado_pago').optional().isIn(['Pendiente','Pagado','Rechazado']).withMessage('Estado de pago no válido'),
    body('referencia_pago').optional().isString().withMessage('La referencia de pago debe ser texto')
    
], async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const { no_reserva, metodo_pago, monto, estado_pago, referencia_pago } = req.body;

        const nuevoPago = await pagos.create({
            no_reserva,
            metodo_pago,
            monto,
            estado_pago,
            referencia_pago
        });

        console.log('Nuevo pago registrado:', nuevoPago);
        res.status(201).json(nuevoPago);

    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el pago' });
    }

})

export default pago;