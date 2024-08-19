"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUrl = void 0;
const valid_url_1 = __importDefault(require("valid-url"));
const isValidUrl = (url) => {
    return valid_url_1.default.isUri(url) ? true : false;
};
exports.isValidUrl = isValidUrl;
