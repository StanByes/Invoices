'use strict';

const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addColumn("invoices", "reduction", {
            type: DataTypes.FLOAT,
            allowNull: true
        });

        await queryInterface.addColumn("invoices", "reduction_type", {
            type: DataTypes.ENUM("PERCENTAGE", "PRICE"),
            allowNull: true
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.removeColumn("invoices", "reduction");
        await queryInterface.removeColumn("invoices", "reduction_type");
    }
};
