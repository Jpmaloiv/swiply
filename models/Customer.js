module.exports = function (sequelize, DataTypes) {
    var Customer = sequelize.define("Customer", {
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
    });

    // User.associate = function (models) {
    //     models.User.hasMany(models.Page, {
    //         foreignKey: {
    //             allowNull: false
    //         }
    //     })
    // }

    return Customer;
};