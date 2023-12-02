"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class project extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            project.belongsTo(models.user, { targetKey: "id", foreignKey: "author_id" });
        }
    }
    project.init(
        {
            title: DataTypes.STRING,
            dateStart: DataTypes.DATEONLY,
            dateEnd: DataTypes.DATEONLY,
            description: DataTypes.TEXT,
            technologies: DataTypes.ARRAY(DataTypes.STRING),
            image: DataTypes.STRING,
            duration: DataTypes.STRING,
            author_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "project",
        }
    );
    return project;
};
