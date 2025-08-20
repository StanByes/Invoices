/** @type {import('sequelize-cli').Migration} */
const {DataTypes} = require("sequelize");
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable('tasks', {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            defaultQuantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            maxQuantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 5
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }, {
            underscored: true
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('tasks');
    }
};
