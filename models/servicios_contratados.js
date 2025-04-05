import { Sequelize } from 'sequelize';

export default function(sequelize, DataTypes) {
  return sequelize.define('servicios_contratados', {
    id_servicio_reserva: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cve_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'servicios',
        key: 'cve_servicio'
      }
    },
    no_reserva: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'reservas',
        key: 'no_reserva'
      }
    },
    cantidad_personas: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'servicios_contratados',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "servicios_contratados_pkey",
        unique: true,
        fields: [
          { name: "id_servicio_reserva" },
        ]
      },
    ]
  });
}