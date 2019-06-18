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

    Charge.associate = function (models) {
        models.Charge.belongsTo(models.Page, {
            foreignKey: {
                allowNull: false
            }
        })
        models.Charge.belongsTo(models.Customer, {
            foreignKey: {
                allowNull: false
            }
        })
    }

    return Charge;
};