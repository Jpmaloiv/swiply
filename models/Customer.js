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
        imageLink: {
            type: DataTypes.STRING
        },
        hash: {
            type: DataTypes.STRING(1500),
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Customer.associate = function (models) {
        models.Customer.belongsToMany(models.Page, {
            through: 'pageAccess',
            as: 'pages',
            foreignKey: 'CustomerId'
        });
    }

    return Customer;
};