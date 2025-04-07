import express from 'express';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';
import { body, validationResult } from 'express-validator';

const models = initModels(sequelize);
const { habitaciones, tipos_cama } = models;

const habitacion = express.Router();

//crear habitaciones

habitacion.post('/crear-habitacion',[
    body('no_camas').notEmpty().isInt().withMessage('El número de camas es requerido y debe ser un número entero'),
    body('id_tipo_cama').notEmpty().isInt().withMessage('El id del tipo de cama es requerido y debe ser un número entero'),
    body('tamano_habitacion').optional().isString().withMessage('Tamaño debe ser texto'),
    body('calidad_habitacion').notEmpty().isIn(['Estandar','Premium','Suite']).withMessage('Calidad no válida'),
    body('precio_habitacion').notEmpty().isFloat().withMessage('Precio inválido'),
    body('estado_habitacion').optional().isIn(['Disponible','Ocupada','Mantenimiento'])
], async (req, res) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { no_camas, id_tipo_cama, tamano_habitacion, calidad_habitacion, precio_habitacion, estado_habitacion } = req.body;

    try{
        const nuevaHabitacion = await habitaciones.create({
            no_camas,
            id_tipo_cama,
            tamano_habitacion,
            calidad_habitacion,
            precio_habitacion,
            estado_habitacion
        });
        res.status(201).json(nuevaHabitacion);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al crear la habitación' });
    }
});

//Actualizar habitaciones
habitacion.put('/actualizar-habitacion/:id',[
    body('no_camas').optional().isInt().withMessage('El número de camas debe ser un número entero'),
    body('id_tipo_cama').optional().isInt().withMessage('El id del tipo de cama debe ser un número entero'),
    body('tamano_habitacion').optional().isString().withMessage('Tamaño debe ser texto'),
    body('calidad_habitacion').optional().isIn(['Estandar','Premium','Suite']).withMessage('Calidad no válida'),
    body('precio_habitacion').optional().isFloat().withMessage('Precio inválido'),
    body('estado_habitacion').optional().isIn(['Disponible','Ocupada','Mantenimiento'])
], async (req, res) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { no_camas, id_tipo_cama, tamano_habitacion, calidad_habitacion, precio_habitacion, estado_habitacion } = req.body;

    try{
        const habitacionExistente = await habitaciones.findByPk(id);
        if(!habitacionExistente){
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        habitacionExistente.no_camas = no_camas;
        habitacionExistente.id_tipo_cama = id_tipo_cama;
        habitacionExistente.tamano_habitacion = tamano_habitacion;
        habitacionExistente.calidad_habitacion = calidad_habitacion;
        habitacionExistente.precio_habitacion = precio_habitacion;
        habitacionExistente.estado_habitacion = estado_habitacion;

        await habitacionExistente.save();
        res.status(200).json(habitacionExistente);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la habitación' });
    }
});

//obtener habitaciones
habitacion.get('/ver-habitaciones', async (req, res) => {
    try {
        const habitacionesList = await habitaciones.findAll({
            include: [{
                model: tipos_cama,
                as: 'id_tipo_cama_tipos_cama', // Usa el alias definido en init-models.js
                attributes: ['nombre_tipo']
            }]
        });
        res.status(200).json(habitacionesList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las habitaciones' });
    }
});

// Obtener solo habitaciones con estado "Disponible"
habitacion.get('/habitaciones-disponibles', async (req, res) => {
    try {
      const disponibles = await habitaciones.findAll({
        where: { estado_habitacion: 'Disponible' }
      });
      res.status(200).json(disponibles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las habitaciones disponibles' });
    }
});

habitacion.post('/seleccionar-habitacion/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const habitacionSeleccionada = await habitaciones.findByPk(id);
  
      if (!habitacionSeleccionada || habitacionSeleccionada.estado_habitacion !== 'Disponible') {
        return res.status(400).json({ error: 'La habitación no está disponible para selección' });
      }
  
      // Aquí podrías crear una reserva o marcar la habitación como ocupada, etc.
      // Por ejemplo:
      // habitacionSeleccionada.estado_habitacion = 'Ocupada';
      // await habitacionSeleccionada.save();
  
      res.status(200).json({ message: 'Habitación seleccionada con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al seleccionar la habitación' });
    }
  });

export default habitacion;