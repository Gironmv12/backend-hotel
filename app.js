import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

import camasRoutes from './routes/camasRoute.js';
import habitacionesRoutes from './routes/habitacionesRoute.js';
import serviciosRoutes from './routes/serviciosRoute.js';
import clientesRoute from './routes/clientesRoute.js';
import pagosRoute from './routes/pagosRoute.js';
import reservacionRoute from './routes/reservacionRoute.js';

import cors from 'cors';

//cargar las variables de entorno
dotenv.config();

//configuracion de los cors
const corsConfig = {
    origin: '*',
    credentials : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
//configuracion de express
const app = express();

app.use(cors(corsConfig));
//mildedware para recibir json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'API is running'
    });
});

//puesto de escucha
const port = process.env.PORT || 5000;

//usar las rutas importadas
//ruta para camas
app.use('/api', camasRoutes);

//ruta para habitaciones
app.use('/api', habitacionesRoutes);

//ruta para servicios
app.use('/api', serviciosRoutes);

//ruta para clientes
app.use('/api', clientesRoute);

//ruta para pagos
app.use('/api', pagosRoute);

//ruta para reservaciones
app.use('/api', reservacionRoute);

//inicializar la base de datos
connectDB().then(() => {
    console.log('Conexión a la base de datos establecida correctamente');

    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
}).catch(error => {
    console.error('No se pudo conectar a la base de datos:', error);
});

