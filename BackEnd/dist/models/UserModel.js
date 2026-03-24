"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../config/database"));
class UserModel extends sequelize_1.Model {
    async validatePassword(plainPassword) {
        return bcrypt_1.default.compare(plainPassword, this.password_hash);
    }
}
const isBcryptHash = (value) => /^\$2[aby]\$\d{2}\$/.test(value);
UserModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    password_hash: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    display_name: {
        type: sequelize_1.DataTypes.STRING(120),
        allowNull: false,
    },
    avatar_url: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    modelName: "UserModel",
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
UserModel.beforeSave(async (user) => {
    if (user.changed("password_hash") &&
        user.password_hash &&
        !isBcryptHash(user.password_hash)) {
        const salt = await bcrypt_1.default.genSalt(10);
        user.password_hash = await bcrypt_1.default.hash(user.password_hash, salt);
    }
});
exports.default = UserModel;
//# sourceMappingURL=UserModel.js.map