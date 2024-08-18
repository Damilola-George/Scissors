"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const url_Routes_1 = __importDefault(require("./routes/url.Routes"));
const db_1 = require("./config/db");
const app = (0, express_1.default)();
// database connection
(0, db_1.connectDb)();
// Middleware setup
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// static files
app.use(express_1.default.static('public'));
// API routes
app.use('/api', url_Routes_1.default);
//  middleware to handle error
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
exports.default = app;
