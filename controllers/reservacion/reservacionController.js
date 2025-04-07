import express from 'express';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';
import { body, validationResult } from 'express-validator';

const models = initModels(sequelize);
const { reservas } = models;

const reservacion = express.Router();

//registrar una reservacion
reservacion.post('/registrar-reservacion',[
    body('curp_cliente').notEmpty().withMessage('La CURP es requerida'),
    body('no_habitacion').notEmpty().isInt().withMessage('El número de habitación es requerido y debe ser un número entero'),
    body('fecha_inicio').notEmpty().isDate().withMessage('La fecha de salida es requerida y debe ser una fecha válida'),
    body('fecha_salida').notEmpty().isDate().withMessage('La fecha de salida es requerida y debe ser una fecha válida'),
    body('total,personas').notEmpty().isInt().withMessage('El total de personas es requerido y debe ser un número entero'),
    body('estado_reserva').optional().isIn(['Pendiente','Confirmada','Cancelada']).withMessage('Estado de reserva no válido'),
], async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const { curp_cliente, no_habitacion, fecha_inicio, fecha_salida, total_personas, estado_reserva } = req.body;
        const nuevaReserva = await reservas.create({
            curp_cliente,
            no_habitacion,
            fecha_inicio,
            fecha_salida,
            total_personas,
            estado_reserva: estado_reserva || 'Pendiente' // Valor por defecto
        });

        console.log("Nueva reserva creada:", nuevaReserva);
        res.status(201).json(nuevaReserva);

    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al registrar la reservación' });
    }
})

export default reservacion;