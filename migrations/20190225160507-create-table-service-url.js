module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('service_url', {
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
    created_at: {
      type: Sequelize.DATE,
    },
    updated_at: {
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('service_url'),
};
