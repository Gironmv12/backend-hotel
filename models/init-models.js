import { DataTypes } from 'sequelize';
import _cancelaciones from './cancelaciones.js';
import _clientes from './clientes.js';
import _entrada_salida from './entrada_salida.js';
import _habitaciones from './habitaciones.js';
import _pagos from './pagos.js';
import _reservas from './reservas.js';
import _servicios from './servicios.js';
import _servicios_contratados from './servicios_contratados.js';
import _tipos_cama from './tipos_cama.js';

function initModels(sequelize) {
  const cancelaciones = _cancelaciones(sequelize, DataTypes);
  const clientes = _clientes(sequelize, DataTypes);
  const entrada_salida = _entrada_salida(sequelize, DataTypes);
  const habitaciones = _habitaciones(sequelize, DataTypes);
  const pagos = _pagos(sequelize, DataTypes);
  const reservas = _reservas(sequelize, DataTypes);
  const servicios = _servicios(sequelize, DataTypes);
  const servicios_contratados = _servicios_contratados(sequelize, DataTypes);
  const tipos_cama = _tipos_cama(sequelize, DataTypes);

  reservas.belongsTo(clientes, { as: "curp_cliente_cliente", foreignKey: "curp_cliente" });
  clientes.hasMany(reservas, { as: "reservas", foreignKey: "curp_cliente" });
  reservas.belongsTo(habitaciones, { as: "no_habitacion_habitacione", foreignKey: "no_habitacion" });
  habitaciones.hasMany(reservas, { as: "reservas", foreignKey: "no_habitacion" });
  cancelaciones.belongsTo(reservas, { as: "no_reserva_reserva", foreignKey: "no_reserva" });
  reservas.hasMany(cancelaciones, { as: "cancelaciones", foreignKey: "no_reserva" });
  entrada_salida.belongsTo(reservas, { as: "no_reserva_reserva", foreignKey: "no_reserva" });
  reservas.hasMany(entrada_salida, { as: "entrada_salidas", foreignKey: "no_reserva" });
  pagos.belongsTo(reservas, { as: "no_reserva_reserva", foreignKey: "no_reserva" });
  reservas.hasMany(pagos, { as: "pagos", foreignKey: "no_reserva" });
  servicios_contratados.belongsTo(reservas, { as: "no_reserva_reserva", foreignKey: "no_reserva" });
  reservas.hasMany(servicios_contratados, { as: "servicios_contratados", foreignKey: "no_reserva" });
  servicios_contratados.belongsTo(servicios, { as: "cve_servicio_servicio", foreignKey: "cve_servicio" });
  servicios.hasMany(servicios_contratados, { as: "servicios_contratados", foreignKey: "cve_servicio" });
  habitaciones.belongsTo(tipos_cama, { as: "id_tipo_cama_tipos_cama", foreignKey: "id_tipo_cama" });
  tipos_cama.hasMany(habitaciones, { as: "habitaciones", foreignKey: "id_tipo_cama" });

  return {
    cancelaciones,
    clientes,
    entrada_salida,
    habitaciones,
    pagos,
    reservas,
    servicios,
    servicios_contratados,
    tipos_cama,
  };
}

export default initModels;
export { initModels };