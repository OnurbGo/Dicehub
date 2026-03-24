"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allDocs = void 0;
const userDocs_1 = require("./userDocs");
const authDocs_1 = require("./authDocs");
exports.allDocs = {
    ...userDocs_1.userDocs,
    ...authDocs_1.authDocs,
};
//# sourceMappingURL=index.js.map