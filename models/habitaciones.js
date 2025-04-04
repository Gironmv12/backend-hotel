const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('habitaciones', {
    no_habitacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    no_camas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tipo_cama: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipos_cama',
        key: 'id_tipo_cama'
      }
    },
    tamano_habitacion: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    calidad_habitacion: {
      type: DataTypes.ENUM("Estandar","Premium","Suite"),
      allowNull: false
    },
    precio_habitacion: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    estado_habitacion: {
      type: DataTypes.ENUM("Disponible","Ocupada","Mantenimiento"),
      allowNull: false,
      defaultValue: "Disponible"
    }
  }, {
    sequelize,
    tableName: 'habitaciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "habitaciones_pkey",
        unique: true,
        fields: [
          { name: "no_habitacion" },
        ]
      },
    ]
  });
};
