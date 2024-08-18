"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCode = exports.shortenUrl = void 0;
const url_Model_1 = __importDefault(require("../models/url.Model"));
const validation_1 = require("../utils/validation");
const shortid_1 = __importDefault(require("shortid"));
const node_cache_1 = __importDefault(require("node-cache"));
const qrcode_1 = __importDefault(require("qrcode"));
// Cache with a standard TTL of 100 seconds and a check period of 120 seconds
const cache = new node_cache_1.default({ stdTTL: 100, checkperiod: 120 });
// Shorten a URL
const shortenUrl = (originalUrl, customUrl) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Received request to shorten URL: ${originalUrl} with custom URL: ${customUrl}`);
    // Validate the URL
    if (!(0, validation_1.isValidUrl)(originalUrl)) {
        console.error('Invalid URL');
        throw new Error('Invalid URL');
    }
    // Check if URL is cached
    let url = cache.get(originalUrl);
    // If the URL is not cached, generate a new short URL
    if (!url) {
        const shortUrl = customUrl || shortid_1.default.generate();
        url = new url_Model_1.default({
            originalUrl,
            shortUrl,
            customUrl,
        });
        // Save the URL in the database
        try {
            yield url.save();
            cache.set(originalUrl, url);
            console.log(`URL saved to database: ${JSON.stringify(url)}`);
        }
        catch (error) {
            console.error('Error saving URL to the database', error);
            throw new Error('Error saving URL to the database');
        }
    }
    else {
        console.log(`URL retrieved from cache: ${JSON.stringify(url)}`);
    }
    return url;
});
exports.shortenUrl = shortenUrl;
// Generate a QR code from a URL
const generateQRCode = (url) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Received request to generate QR code for URL: ${url}`);
    try {
        const qrCodeData = yield qrcode_1.default.toDataURL(url);
        console.log('QR code generated successfully');
        return qrCodeData;
    }
    catch (error) {
        console.error('Error generating QR code', error);
        throw new Error('Error generating QR code');
    }
});
exports.generateQRCode = generateQRCode;
