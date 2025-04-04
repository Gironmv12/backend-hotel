var DataTypes = require("sequelize").DataTypes;
var _cancelaciones = require("./cancelaciones");
var _clientes = require("./clientes");
var _entrada_salida = require("./entrada_salida");
var _habitaciones = require("./habitaciones");
var _pagos = require("./pagos");
var _reservas = require("./reservas");
var _servicios = require("./servicios");
var _servicios_contratados = require("./servicios_contratados");
var _tipos_cama = require("./tipos_cama");

function initModels(sequelize) {
  var cancelaciones = _cancelaciones(sequelize, DataTypes);
  var clientes = _clientes(sequelize, DataTypes);
  var entrada_salida = _entrada_salida(sequelize, DataTypes);
  var habitaciones = _habitaciones(sequelize, DataTypes);
  var pagos = _pagos(sequelize, DataTypes);
  var reservas = _reservas(sequelize, DataTypes);
  var servicios = _servicios(sequelize, DataTypes);
  var servicios_contratados = _servicios_contratados(sequelize, DataTypes);
  var tipos_cama = _tipos_cama(sequelize, DataTypes);

  reservas.belongsTo(clientes, { as: "curp_cliente_cliente", foreignKey: "curp_cliente"});
  clientes.hasMany(reservas, { as: "reservas", foreignKey: "curp_cliente"});
  reservas.belongsTo(habitaciones, { as: "no_habitacion_habitacione", foreignKey: "no_habitacion"});
  habitaciones.hasMany(reservas, { as: "reservas", foreignKey: "no_habitacion"});
  cancelaciones.belongsTo(reservas, { as: "no_reserva_reserva", foreignKey: "no_reserva"});
  reservas.hasMany(cancelaciones, { as: "cancelaciones", foreignKey: "no_reserva"});
  entrada_salida.belongsTo(reservas, { as: "no_reserva_reserva", foreignKey: "no_reserva"});
  reservas.hasMany(entrada_salida, { as: "entrada_salidas", foreignKey: "no_reserva"});
  pagos.belongsTo(reservas, { as: "no_reserva_reserva", foreignKey: "no_reserva"});
  reservas.hasMany(pagos, { as: "pagos", foreignKey: "no_reserva"});
  servicios_contratados.belongsTo(reservas, { as: "no_reserva_reserva", foreignKey: "no_reserva"});
  reservas.hasMany(servicios_contratados, { as: "servicios_contratados", foreignKey: "no_reserva"});
  servicios_contratados.belongsTo(servicios, { as: "cve_servicio_servicio", foreignKey: "cve_servicio"});
  servicios.hasMany(servicios_contratados, { as: "servicios_contratados", foreignKey: "cve_servicio"});
  habitaciones.belongsTo(tipos_cama, { as: "id_tipo_cama_tipos_cama", foreignKey: "id_tipo_cama"});
  tipos_cama.hasMany(habitaciones, { as: "habitaciones", foreignKey: "id_tipo_cama"});

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
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
