module.exports = function (sequelize, DataTypes) {
    const Charge = sequelize.define("Charge", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        amount: {
            type: DataTypes.STRING
        },

    });

    // Page.associate = function (models) {
    //     models.Page.belongsTo(models.User, {
    //         foreignKey: {
    //             allowNull: false
    //         }
    //     })
    //     models.Page.hasMany(models.Content, {
    //         foreignKey: {
    //             allowNull: false
    //         }
    //     })
    // }

    return Charge;
};