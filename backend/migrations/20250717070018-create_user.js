/** @type {import('sequelize-cli').Migration} */
const {DataTypes} = require("sequelize");
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
          allowNull: false
      },
      username: {
        type: new DataTypes.STRING(100),
        allowNull: false
      },
      email: {
        type: new DataTypes.STRING(100),
        allowNull: false
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    }, {
        underscored: true
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  }
};
