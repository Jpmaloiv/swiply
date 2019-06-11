module.exports = function (sequelize, DataTypes) {
    var Content = sequelize.define("Content", {
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        link: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        },
        fileLink: {
            type: DataTypes.STRING
        }
    },
        {
            freezeTableName: true,
        });

    return Content;
};