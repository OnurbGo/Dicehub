"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
class UserController {
    // Upload de avatar
    static async uploadAvatar(req, res) {
        try {
            // Pega o ID do usuário (você vai extrair do JWT depois)
            const userId = req.userId; // vem do middleware de autenticação
            if (!req.file) {
                return res.status(400).json({ error: "Nenhum arquivo enviado" });
            }
            const user = await UserModel_1.default.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            // Salva a URL relativa no banco
            const avatarUrl = `/img_upload/${req.file.filename}`;
            user.avatar_url = avatarUrl;
            await user.save();
            return res.status(200).json({
                message: "Avatar atualizado com sucesso",
                avatar_url: avatarUrl,
                user,
            });
        }
        catch (error) {
            console.error("Erro ao fazer upload:", error);
            return res.status(500).json({ error: "Erro ao fazer upload" });
        }
    }
    // Exemplo de get user
    static async getUser(req, res) {
        try {
            const userId = req.userId;
            const user = await UserModel_1.default.findByPk(userId, {
                attributes: { exclude: ["password_hash"] },
            });
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao buscar usuário" });
        }
    }
    static async getAll(req, res) {
        try {
            const users = await UserModel_1.default.findAll({
                attributes: { exclude: ["password_hash"] },
            });
            return res.status(200).json(users);
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao listar usuários" });
        }
    }
    static async getUserById(req, res) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            const user = await UserModel_1.default.findByPk(id, {
                attributes: { exclude: ["password_hash"] },
            });
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao buscar usuário" });
        }
    }
    static async updateUser(req, res) {
        try {
            const id = Number(req.params.id);
            const authUserId = Number(req.user?.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            if (!authUserId || authUserId !== id) {
                return res
                    .status(403)
                    .json({ error: "Sem permissão para atualizar este usuário" });
            }
            const { email, display_name, avatar_url } = req.body;
            const user = await UserModel_1.default.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            if (email !== undefined)
                user.email = email;
            if (display_name !== undefined)
                user.display_name = display_name;
            if (avatar_url !== undefined)
                user.avatar_url = avatar_url;
            await user.save();
            const safeUser = user.toJSON();
            delete safeUser.password_hash;
            return res.status(200).json({
                message: "Usuário atualizado com sucesso",
                user: safeUser,
            });
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao atualizar usuário" });
        }
    }
    static async destroyUserById(req, res) {
        try {
            const id = Number(req.params.id);
            const authUserId = Number(req.user?.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            if (!authUserId || authUserId !== id) {
                return res
                    .status(403)
                    .json({ error: "Sem permissão para remover este usuário" });
            }
            const user = await UserModel_1.default.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            await user.destroy();
            return res.status(200).json({ message: "Usuário removido com sucesso" });
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao remover usuário" });
        }
    }
    static async uploadAvatarById(req, res) {
        try {
            const id = Number(req.params.id);
            const authUserId = Number(req.user?.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }
            if (!authUserId || authUserId !== id) {
                return res
                    .status(403)
                    .json({ error: "Sem permissão para alterar avatar deste usuário" });
            }
            if (!req.file) {
                return res.status(400).json({ error: "Nenhum arquivo enviado" });
            }
            const user = await UserModel_1.default.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            const avatarUrl = "/img_upload/" + req.file.filename;
            user.avatar_url = avatarUrl;
            await user.save();
            const safeUser = user.toJSON();
            delete safeUser.password_hash;
            return res.status(200).json({
                message: "Avatar atualizado com sucesso",
                avatar_url: avatarUrl,
                user: safeUser,
            });
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao fazer upload" });
        }
    }
    static async createUser(req, res) {
        try {
            const { email, display_name, password } = req.body;
            if (!email || !display_name || !password) {
                return res.status(400).json({
                    error: "email, display_name e password são obrigatórios",
                });
            }
            const existingUser = await UserModel_1.default.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ error: "Email já está em uso" });
            }
            const user = await UserModel_1.default.create({
                email,
                display_name,
                password_hash: password,
            });
            const safeUser = user.toJSON();
            delete safeUser.password_hash;
            return res.status(201).json({
                message: "Usuário criado com sucesso",
                user: safeUser,
            });
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao criar usuário" });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map