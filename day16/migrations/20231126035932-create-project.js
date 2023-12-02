"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("projects", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
            },
            startDate: {
                type: Sequelize.DATEONLY,
            },
            endDate: {
                type: Sequelize.DATEONLY,
            },
            description: {
                type: Sequelize.TEXT,
            },
            technologies: {
                type: Sequelize.ARRAY(Sequelize.STRING),
            },
            image: {
                type: Sequelize.STRING,
            },
            duration: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            author_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("projects");
    },
};
