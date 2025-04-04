const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pagos', {
    no_pago: {
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
    metodo_pago: {
      type: DataTypes.ENUM("Tarjeta","PayPal","Efectivo"),
      allowNull: false
    },
    monto: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    estado_pago: {
      type: DataTypes.ENUM("Pendiente","Pagado","Rechazado"),
      allowNull: false,
      defaultValue: "Pendiente"
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    referencia_pago: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: "pagos_referencia_pago_key"
    }
  }, {
    sequelize,
    tableName: 'pagos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pagos_pkey",
        unique: true,
        fields: [
          { name: "no_pago" },
        ]
      },
      {
        name: "pagos_referencia_pago_key",
        unique: true,
        fields: [
          { name: "referencia_pago" },
        ]
      },
    ]
  });
};
