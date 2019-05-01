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
        imageLink: {
            type: DataTypes.STRING
        },
        published: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return Page;
};