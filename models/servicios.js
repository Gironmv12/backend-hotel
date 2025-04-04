const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('servicios', {
    cve_servicio: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_servicio: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'servicios',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "servicios_pkey",
        unique: true,
        fields: [
          { name: "cve_servicio" },
        ]
      },
    ]
  });
};
