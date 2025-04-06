import express from 'express';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';
import { body, validationResult } from 'express-validator';

const models = initModels(sequelize);
const { servicios } = models;

const servicio = express.Router();

//crear servicios
servicio.post('/crear-servicio',[
    body('nombre_servicio').notEmpty().isString().withMessage('El nombre del servicio es requerido y debe ser texto'),
    body('descripcion').notEmpty().isString().withMessage('La descripción es requerida y debe ser texto'),
    body('precio').notEmpty().isFloat().withMessage('El precio es requerido y debe ser un número')
],async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const { nombre_servicio, descripcion, precio } = req.body;
        const nuevoServicio = await servicios.create({
            nombre_servicio,
            descripcion,
            precio
        });
        return res.status(201).json({ message: 'Servicio creado exitosamente', servicio: nuevoServicio });

    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al crear el servicio' });
    }
});

//Actualizar servicios
servicio.put('/actualizar-servicio/:id',[
    body('nombre_servicio').optional().isString().withMessage('El nombre del servicio debe ser texto'),
    body('descripcion').optional().isString().withMessage('La descripción debe ser texto'),
    body('precio').optional().isFloat().withMessage('El precio debe ser un número')
],async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const { id } = req.params;
        const { nombre_servicio, descripcion, precio } = req.body;

        const servicioActualizado = await servicios.update({
            nombre_servicio,
            descripcion,
            precio
        }, {
            where: { cve_servicio: id }
        });

        if(servicioActualizado[0] === 0){
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        return res.status(200).json({ message: 'Servicio actualizado exitosamente' });

    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el servicio' });
    }
});

//ver servicios
servicio.get('/ver-servicios', async (req, res) => {
    try {
        const listaServicios = await servicios.findAll();
        return res.status(200).json(listaServicios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los servicios' });
    }
});

//eliminar servicios
servicio.delete('/eliminar-servicio/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const servicioEliminado = await servicios.destroy({
            where: { cve_servicio: id }
        });

        if(servicioEliminado === 0){
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        return res.status(200).json({ message: 'Servicio eliminado exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el servicio' });
    }
});

export default servicio;