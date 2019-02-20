const Sequelize = require('sequelize');
const db = require('../config/database');

const UrlService = db.define('URL', {
  svc_name: {
    allowNull: false,
    type: Sequelize.VARCHAR,
    defaultValue: null,
  },
  url: {
    allowNull: true,
    type: Sequelize.TEXT,
    defaultValue: null,
  },
}, {
  tableName: 'url_service',
});

module.exports = UrlService;
