/** @type {import('sequelize-cli').Migration} */
const {DataTypes} = require("sequelize");
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable('clients', {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER.UNSIGNED,
                unique: true,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id"
                }
            },
            firstName: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            companyId: DataTypes.INTEGER,
            companyName: DataTypes.STRING(100),
            phone: {
                type: DataTypes.STRING(15),
                allowNull: false
            },
            address: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            city: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            zip: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }, {
            underscored: true
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('clients');
    }
};
