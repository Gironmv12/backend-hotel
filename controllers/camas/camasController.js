import express from 'express';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';
import { body, validationResult } from 'express-validator';

const models = initModels(sequelize);
const {tipos_cama} = models;
const camas = express.Router();

//crear tipos de cama
camas.post('/crear-tipos-cama', [
    body('nombre_tipo').notEmpty().withMessage('El nombre del tipo de cama es requerido'),
    body('descripcion').optional().isString().withMessage('La descripción debe ser un texto')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {nombre_tipo, descripcion} = req.body;
    try{
        const tipoCama = await tipos_cama.create({
            nombre_tipo,
            descripcion
        });
        res.status(201).json(tipoCama);

    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al crear el tipo de cama' });

    }
});

//actualizar tipos de cama
camas.put('/actualizar-tipos-cama/:id', [
    body('nombre_tipo').notEmpty().withMessage('El nombre del tipo de cama es requerido'),
    body('descripcion').optional().isString().withMessage('La descripción debe ser un texto')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { nombre_tipo, descripcion } = req.body;

    try {
        const tipoCama = await tipos_cama.findByPk(id);
        if (!tipoCama) {
            return res.status(404).json({ error: 'Tipo de cama no encontrado' });
        }

        tipoCama.nombre_tipo = nombre_tipo;
        tipoCama.descripcion = descripcion;

        await tipoCama.save();
        res.status(200).json(tipoCama);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el tipo de cama' });
    }
});

//ver tipos de cama
camas.get('/ver-tipos-cama', async (req, res) => {
    try{
        const tiposCama = await tipos_cama.findAll();
        res.status(200).json(tiposCama);
    }catch(error){
        res.status(500).json({ error: 'Error al obtener los tipos de cama' });
    }
});

export default camas;