import express from 'express';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';
import { body, validationResult } from 'express-validator';

const models = initModels(sequelize);
const { clientes } = models;

const cliente = express.Router();

//dar de alta a un cliente