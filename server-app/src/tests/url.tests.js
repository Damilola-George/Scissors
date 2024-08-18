import { isValidUrl } from '../utils/validation';
import UrlModel from '../models/url.Model';
import { generateQRCode, shortenUrl } from '../services/url.Service';
import NodeCache from 'node-cache';
import QRCode from 'qrcode';

jest.mock('../src/models/urlModel');
jest.mock('../src/utils/validateUrl');
jest.mock('node-cache');
jest.mock('qrcode');

describe('URL Shortening Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should shorten a valid URL', async () => {
        (isValidUrl as jest.Mock).mockReturnValue(true);
        (UrlModel.prototype.save as jest.Mock).mockResolvedValue({ shortUrl: 'short.ly/abc123' });
        const result = await shortenUrl('http://protech.com');
        expect(result).toHaveProperty('shortUrl', 'short.ly/abc123');
    });

    it('should throw an error for an invalid URL', async () => {
        (isValidUrl as jest.Mock).mockReturnValue(false);
        await expect(shortenUrl('invalid-url')).rejects.toThrow('Invalid URL');
    });

    it('should create a shortened URL with a custom alias', async () => {
        (isValidUrl as jest.Mock).mockReturnValue(true);
        (UrlModel.prototype.save as jest.Mock).mockResolvedValue({ shortUrl: 'customAlias' });
        const result = await shortenUrl('http://protech.com', 'customAlias');
        expect(result).toHaveProperty('shortUrl', 'customAlias');
    });

    it('should return the same shortened URL if the original URL was already shortened', async () => {
        const mockUrl = { originalUrl: 'http://protech.com', shortUrl: 'protech' };
        (isValidUrl as jest.Mock).mockReturnValue(true);
        (NodeCache.prototype.get as jest.Mock).mockReturnValue(mockUrl);
        const result = await shortenUrl('http://protech.com');
        expect(result).toEqual(mockUrl);
    });

    it('should generate a QR code for a valid shortened URL', async () => {
        const mockQRCode = 'data:image/png;base64,...';
        (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockQRCode);
        const result = await generateQRCode('http://protech.url/protech');
        expect(result).toBe(mockQRCode);
    });

    it('should track the number of clicks on a shortened URL', async () => {
        // Implement this test based on your click tracking logic
    });
});