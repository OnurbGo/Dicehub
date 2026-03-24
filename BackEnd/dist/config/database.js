"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const isTest = process.env.NODE_ENV === "test";
const sequelize = new sequelize_1.Sequelize((isTest ? process.env.DB_TEST : process.env.DB_OFICIAL), process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: !isTest,
});
exports.default = sequelize;
//# sourceMappingURL=database.js.map