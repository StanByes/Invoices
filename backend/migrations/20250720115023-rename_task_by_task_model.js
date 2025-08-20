'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.renameTable("tasks", "task_models");
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.renameTable("task_models", "tasks");
  }
};
