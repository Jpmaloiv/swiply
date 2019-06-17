module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    plan: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imageLink: {
      type: DataTypes.STRING
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true
    },
    twitter: {
      type: DataTypes.STRING,
      allowNull: true
    },
    linkedIn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    whatsapp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    remember: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    hash: {
      type: DataTypes.STRING(1500),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetExpiry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accountId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  User.associate = function (models) {
    models.User.hasMany(models.Page, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return User;
};
