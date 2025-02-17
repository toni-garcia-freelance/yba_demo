'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tasks', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('TODO', 'IN_PROGRESS', 'DONE'),
        defaultValue: 'TODO'
      },
      parentTaskId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Tasks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Ajout d'un index sur userId pour améliorer les performances des requêtes
    await queryInterface.addIndex('Tasks', ['userId']);
    
    // Ajout d'un index sur parentTaskId pour améliorer les performances des requêtes de hiérarchie
    await queryInterface.addIndex('Tasks', ['parentTaskId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tasks');
  }
}; 