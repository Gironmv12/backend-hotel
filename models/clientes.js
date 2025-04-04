const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clientes', {
    curp_cliente: {
      type: DataTypes.STRING(18),
      allowNull: false,
      primaryKey: true
    },
    nombre_cliente: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    ap_pat_cliente: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    ap_mat_cliente: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    no_telefono_cliente: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    correo_cliente: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "clientes_correo_cliente_key"
    },
    rfc_cliente: {
      type: DataTypes.STRING(13),
      allowNull: true,
      unique: "clientes_rfc_cliente_key"
    }
  }, {
    sequelize,
    tableName: 'clientes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "clientes_correo_cliente_key",
        unique: true,
        fields: [
          { name: "correo_cliente" },
        ]
      },
      {
        name: "clientes_pkey",
        unique: true,
        fields: [
          { name: "curp_cliente" },
        ]
      },
      {
        name: "clientes_rfc_cliente_key",
        unique: true,
        fields: [
          { name: "rfc_cliente" },
        ]
      },
    ]
  });
};
