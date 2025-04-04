const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('entrada_salida', {
    id_verificacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_reserva: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'reservas',
        key: 'no_reserva'
      }
    },
    fecha_entrada: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora_entrada: {
      type: DataTypes.TIME,
      allowNull: false
    },
    fecha_salida: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora_salida: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'entrada_salida',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "entrada_salida_pkey",
        unique: true,
        fields: [
          { name: "id_verificacion" },
        ]
      },
    ]
  });
};
