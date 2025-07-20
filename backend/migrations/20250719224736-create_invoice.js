/** @type {import('sequelize-cli').Migration} */
const {DataTypes} = require("sequelize");
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable('invoices', {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            clientId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: "clients",
                    key: "id"
                }
            },
            total: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            payed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }, {
            underscored: true
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('invoices');
    }
};
