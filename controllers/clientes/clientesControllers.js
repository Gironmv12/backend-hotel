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
    body('ap_mat_cliente').optional().isString().withMessage('El apellido materno debe ser texto'),
    body('no_telefono_cliente').notEmpty().isString().withMessage('El número de teléfono es requerido y debe ser texto'),
    body('correo_cliente').notEmpty().isEmail().withMessage('El correo es requerido y debe ser un correo electrónico válido'),
    body('rfc_cliente').optional().isString().withMessage('El RFC debe ser texto'),
], async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const { curp_cliente, nombre_cliente, ap_pat_cliente,ap_mat_cliente, no_telefono_cliente, correo_cliente, rfc_cliente } = req.body;

        // Verificar si el cliente ya existe
        const clienteExistente = await clientes.findOne({ where: { curp_cliente } });
        if(clienteExistente){
            return res.status(400).json({ error: 'El cliente ya está registrado' });
        }

        const nuevoCliente = await clientes.create({
            curp_cliente,
            nombre_cliente,
            ap_pat_cliente,
            ap_mat_cliente,
            no_telefono_cliente,
            correo_cliente,
            rfc_cliente
        });

        res.status(201).json(nuevoCliente);

    }catch(error){ 
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el cliente' });
    }
})

//obtener clientes
cliente.get('/clientes', async (req, res) =>{
    try{
        const clientesList = await clientes.findAll();
        res.status(200).json(clientesList);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
})

//actualizar cliente
cliente.put('/actualizar-cliente/:id',[
    body('curp_cliente').optional().notEmpty().withMessage('La CURP es requerida'),
    body('nombre_cliente').optional().notEmpty().isString().withMessage('El nombre es requerido y debe ser texto'),
    body('ap_pat_cliente').optional().notEmpty().isString().withMessage('El apellido paterno es requerido y debe ser texto'),
    body('no_telefono_cliente').optional().notEmpty().isString().withMessage('El número de teléfono es requerido y debe ser texto'),
    body('correo_cliente').optional().notEmpty().isEmail().withMessage('El correo es requerido y debe ser un correo electrónico válido'),
    body('rfc_cliente').optional().isString().withMessage('El RFC debe ser texto'),
], async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const { id } = req.params;
        const { curp_cliente, nombre_cliente, ap_pat_cliente, no_telefono_cliente, correo_cliente, rfc_cliente } = req.body;

        const clienteActualizado = await clientes.update({
            curp_cliente,
            nombre_cliente,
            ap_pat_cliente,
            no_telefono_cliente,
            correo_cliente,
            rfc_cliente
        }, {
            // Usar la CURP (clave primaria) como criterio
            where: { curp_cliente: id }
        });

        if(clienteActualizado[0] === 0){
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json({ message: 'Cliente actualizado exitosamente' });

    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
})
//eliminar cliente
cliente.delete('/eliminar-cliente/:id', async (req, res) =>{
    try{
        const { id } = req.params;

        const clienteEliminado = await clientes.destroy({
            // Usar el curp_cliente como filtro, ya que es la clave primaria
            where: { curp_cliente: id }
        });

        if(clienteEliminado === 0){
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json({ message: 'Cliente eliminado exitosamente' });

    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
})
export default cliente;