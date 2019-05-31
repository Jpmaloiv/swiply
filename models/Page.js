module.exports = function (sequelize, DataTypes) {
    var Page = sequelize.define("Page", {
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        summary: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.STRING
        },
        imageLink: {
            type: DataTypes.STRING
        },
        published: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        views: {
            type: DataTypes.STRING,
            defaultValue: 0
        },
        order: {
            type: DataTypes.STRING
        },
    });

    Page.associate = function (models) {
        models.Page.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
        models.Page.hasMany(models.Content, {
            foreignKey: {
                allowNull: false
            }
        })
    }

    return Page;
};