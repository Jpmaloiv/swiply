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
        revenue: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        purchases: {
            type: DataTypes.STRING,
            defaultValue: 0
        },
        imageLink: {
            type: DataTypes.STRING
        },
        position: {
            type: DataTypes.STRING
        },
        published: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        displayProfile: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        views: {
            type: DataTypes.INTEGER,
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
        }),
            models.Page.hasMany(models.Charge, {
                foreignKey: {
                    allowNull: false
                }
            })
    }

    return Page;
};