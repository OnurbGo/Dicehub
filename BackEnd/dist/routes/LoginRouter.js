"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LoginController_1 = require("../controllers/LoginController");
const loginRouter = (0, express_1.Router)();
loginRouter.post("/login", LoginController_1.LoginUser);
exports.default = loginRouter;
//# sourceMappingURL=LoginRouter.js.map