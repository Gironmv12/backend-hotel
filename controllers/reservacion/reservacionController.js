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
    body('total_personas').notEmpty().isInt().withMessage('El total de personas es requerido y debe ser un número entero'),
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

//obtener reservaciones
reservacion.get('/reservaciones', async (req, res) =>{
    try{
        const reservaciones = await reservas.findAll();
        res.status(200).json(reservaciones);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las reservaciones' });
    }
})

//actualizar reservacion
reservacion.put('/actualizar-reservacion/:id',[
    body('curp_cliente').optional().notEmpty().withMessage('La CURP es requerida'),
    body('no_habitacion').optional().notEmpty().isInt().withMessage('El número de habitación es requerido y debe ser un número entero'),
    body('fecha_inicio').optional().notEmpty().isDate().withMessage('La fecha de salida es requerida y debe ser una fecha válida'),
    body('fecha_salida').optional().notEmpty().isDate().withMessage('La fecha de salida es requerida y debe ser una fecha válida'),
    body('total_personas').optional().notEmpty().isInt().withMessage('El total de personas es requerido y debe ser un número entero'),
    body('estado_reserva').optional().isIn(['Pendiente','Confirmada','Cancelada']).withMessage('Estado de reserva no válido'),
], async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const { id } = req.params;
        const { curp_cliente, no_habitacion, fecha_inicio, fecha_salida, total_personas, estado_reserva } = req.body;

        const reservaActualizada = await reservas.update({
            curp_cliente,
            no_habitacion,
            fecha_inicio,
            fecha_salida,
            total_personas,
            estado_reserva
        }, {
            where: { id_reserva: id }
        });

        if(reservaActualizada[0] === 0){
            return res.status(404).json({ error: 'Reservación no encontrada' });
        }

        console.log("Reservación actualizada:", reservaActualizada);
        res.status(200).json({ message: 'Reservación actualizada exitosamente' });

    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la reservación' });
    }
})

reservacion.get('/detalles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const reservacionData = await reservas.findByPk(id, {
            include: [
                {
                    association: "no_habitacion_habitacione", // Asociación con habitaciones
                    attributes: ["no_habitacion", "calidad_habitacion", "precio_habitacion"] // Actualiza según tus columnas reales
                },
                {
                    association: "curp_cliente_cliente", // Asociación con clientes
                    attributes: ["nombre_cliente", "correo_cliente", "no_telefono_cliente"]
                },
                {
                    association: "servicios_contratados", // Asociación con servicios contratados
                    include: [{
                        association: "cve_servicio_servicio", // Asociación con servicios
                        attributes: ["nombre_servicio", "precio"]
                    }]
                }
            ]
        });

        if (!reservacionData) {
            return res.status(404).json({ error: "Reservación no encontrada" });
        }

        let serviciosTotal = 0;
        reservacionData.servicios_contratados.forEach(servicioItem => {
            serviciosTotal += parseFloat(servicioItem.cve_servicio_servicio.precio) * servicioItem.cantidad_personas;
        });
        const total = parseFloat(reservacionData.no_habitacion_habitacione.precio_habitacion) + serviciosTotal;        
        res.json({
            habitacion: reservacionData.no_habitacion_habitacione,
            cliente: reservacionData.curp_cliente_cliente,
            servicios: reservacionData.servicios_contratados,
            total: total
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los detalles de la reservación" });
    }
})

export default reservacion;