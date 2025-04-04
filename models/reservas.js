const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reservas', {
    no_reserva: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    curp_cliente: {
      type: DataTypes.STRING(18),
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'curp_cliente'
      }
    },
    no_habitacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'habitaciones',
        key: 'no_habitacion'
      }
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_salida: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    total_personas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado_reserva: {
      type: DataTypes.ENUM("Pendiente","Confirmada","Cancelada"),
      allowNull: false,
      defaultValue: "Pendiente"
    }
  }, {
    sequelize,
    tableName: 'reservas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "reservas_pkey",
        unique: true,
        fields: [
          { name: "no_reserva" },
        ]
      },
    ]
  });
};
