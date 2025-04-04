const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cancelaciones', {
    no_cancelacion: {
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
    motivo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha_cancelacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    realizado_por: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cancelaciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "cancelaciones_pkey",
        unique: true,
        fields: [
          { name: "no_cancelacion" },
        ]
      },
    ]
  });
};
