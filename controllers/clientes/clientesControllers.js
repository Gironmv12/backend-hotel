import express from 'express';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';
import { body, validationResult } from 'express-validator';

const models = initModels(sequelize);
const { clientes } = models;

const cliente = express.Router();

//registrar un cliente
cliente.post('/registrar-cliente',[
    body('curp_cliente').notEmpty().withMessage('La CURP es requerida'),
    body('nombre_cliente').notEmpty().isString().withMessage('El nombre es requerido y debe ser texto'),
    body('ap_pat_cliente').notEmpty().isString().withMessage('El apellido paterno es requerido y debe ser texto'),
    body('no_telefono_cliente').notEmpty().isString().withMessage('El número de teléfono es requerido y debe ser texto'),
    body('correo_cliente').notEmpty().isEmail().withMessage('El correo es requerido y debe ser un correo electrónico válido')
], async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const { curp_cliente, nombre_cliente, ap_pat_cliente, no_telefono_cliente, correo_cliente } = req.body;

        // Verificar si el cliente ya existe
        const clienteExistente = await clientes.findOne({ where: { curp_cliente } });
        if(clienteExistente){
            return res.status(400).json({ error: 'El cliente ya está registrado' });
        }

        const nuevoCliente = await clientes.create({
            curp_cliente,
            nombre_cliente,
            ap_pat_cliente,
            no_telefono_cliente,
            correo_cliente
        });

        res.status(201).json(nuevoCliente);

    }catch(error){ 
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el cliente' });
    }
})

export default cliente;