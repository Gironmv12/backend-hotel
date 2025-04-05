import { Sequelize } from 'sequelize';

export default function(sequelize, DataTypes) {
  return sequelize.define('tipos_cama', {
    id_tipo_cama: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "tipos_cama_nombre_tipo_key"
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tipos_cama',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tipos_cama_nombre_tipo_key",
        unique: true,
        fields: [
          { name: "nombre_tipo" },
        ]
      },
      {
        name: "tipos_cama_pkey",
        unique: true,
        fields: [
          { name: "id_tipo_cama" },
        ]
      },
    ]
  });
}