module.exports = function (sequelize, DataTypes) {
    var Content = sequelize.define("Content", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }
    },
        {
            freezeTableName: true,
        });

    return Content;
};