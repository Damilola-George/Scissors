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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const url_Controller_1 = require("../controllers/url.Controller");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
// POST route for URL shortening and QR code generation
router.post('/shorten', rateLimiter_1.rateLimiterMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, url_Controller_1.createShortUrl)(req, res);
    }
    catch (error) {
        console.error('Error in /shorten route:', error);
        res.render('index', { errorMessage: 'Failed to create short URL. Please try again.' });
    }
}));
// GET route for link history
router.get('/history', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, url_Controller_1.getLinkHistory)(req, res);
    }
    catch (error) {
        console.error('Error in /history route:', error);
        res.status(500).render('index', { errorMessage: 'Failed to fetch link history. Please try again later.' });
    }
}));
// GET route for redirection from the short URL
router.get('/:shortUrl', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, url_Controller_1.getShortUrl)(req, res);
    }
    catch (error) {
        console.error('Error in /:shortUrl route:', error);
        res.status(500).render('index', { errorMessage: 'Failed to redirect. Please try again later.' });
    }
}));
// GET route to serve the QR code for a specific shortened URL
router.get('/qr/:shortUrl', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, url_Controller_1.getQRCode)(req, res);
    }
    catch (error) {
        console.error('Error in /qr/:shortUrl route:', error);
        res.status(500).render('index', { errorMessage: 'Failed to generate QR code. Please try again later.' });
    }
}));
exports.default = router;
