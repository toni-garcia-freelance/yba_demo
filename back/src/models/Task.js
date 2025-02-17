const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

class Task extends Model {}

Task.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('TODO', 'IN_PROGRESS', 'DONE'),
    defaultValue: 'TODO'
  },
  parentTaskId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Tasks',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Task',
  tableName: 'Tasks'
});

// Définition des associations
Task.associate = (models) => {
  Task.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Task.belongsTo(Task, {
    foreignKey: 'parentTaskId',
    as: 'parentTask'
  });

  Task.hasMany(Task, {
    foreignKey: 'parentTaskId',
    as: 'subTasks'
  });
};

module.exports = Task; 