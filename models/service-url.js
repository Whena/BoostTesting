const Sequelize = require('sequelize');
const db = require('../configs/database');

const ServiceUrl = db.define(
  'service_url',
  {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    svc_name: {
      type: Sequelize.STRING,
      unique: true,
    },
    url: {
      type: Sequelize.STRING(1000),
    },
    alias: {
      type: Sequelize.STRING,
      unique: true,
    },
    is_active: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'service_url',
    underscored: true,
  },
);

module.exports = ServiceUrl;
