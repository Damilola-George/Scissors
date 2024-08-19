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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // 
const nanoid_1 = require("nanoid");
const url_Model_1 = __importDefault(require("../models/url.Model")); // Assuming you have a URL model
// Test the Url Shortening Functionality
describe('URL Shortening', () => {
    it('should create a shortened URL', () => __awaiter(void 0, void 0, void 0, function* () {
        const longUrl = 'https://www.example.com/very/long/url';
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/shorten').send({ longUrl });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('shortUrl');
        const shortUrl = res.body.shortUrl;
        const urlDoc = yield url_Model_1.default.findOne({ shortUrl });
        expect(urlDoc).toBeDefined();
    }));
});
// Test the URL redirection functionality 
describe('URL Redirection', () => {
    it('should redirect to the original URL', () => __awaiter(void 0, void 0, void 0, function* () {
        const longUrl = 'https://www.example.com/very/long/url';
        const shortUrl = (0, nanoid_1.nanoid)(8); // Generate a random short URL
        yield url_Model_1.default.create({ longUrl, shortUrl });
        const res = yield (0, supertest_1.default)(app_1.default).get(`/${shortUrl}`).redirects(1);
        expect(res.statusCode).toBe(200);
        expect(res.headers.location).toBe(longUrl);
    }));
});
// Test the custom URL functionality
describe('Custom URL', () => {
    it('should create a shortened URL with a custom alias', () => __awaiter(void 0, void 0, void 0, function* () {
        const longUrl = 'https://www.example.com/very/long/url';
        const customAlias = 'myshorturl';
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/shorten').send({ longUrl, customAlias });
        expect(res.statusCode).toBe(200);
        expect(res.body.shortUrl).toBe(`http://localhost/${customAlias}`);
        const urlDoc = yield url_Model_1.default.findOne({ shortUrl: customAlias });
        expect(urlDoc).toBeDefined();
    }));
    it('should return an error for an invalid custom alias', () => __awaiter(void 0, void 0, void 0, function* () {
        const longUrl = 'https://www.example.com/very/long/url';
        const invalidAlias = 'invalid/alias';
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/shorten').send({ longUrl, customAlias: invalidAlias });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('Invalid custom alias');
    }));
});
// Test the URL expiration functionality :
describe('URL Expiration', () => {
    it('should expire the shortened URL after the expiration date', () => __awaiter(void 0, void 0, void 0, function* () {
        const longUrl = 'https://www.example.com/very/long/url';
        const expirationDate = new Date(Date.now() + 60 * 1000); // 1 minute from now
        const shortUrl = (0, nanoid_1.nanoid)(8);
        yield url_Model_1.default.create({ longUrl, shortUrl, expirationDate });
        // Wait for the expiration date to pass
        yield new Promise((resolve) => setTimeout(resolve, 61 * 1000));
        const res = yield (0, supertest_1.default)(app_1.default).get(`/${shortUrl}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('URL has expired');
    }));
});
