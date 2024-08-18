import { Request, Response } from 'express';
import { shortenUrl, generateQRCode } from '../services/url.Service';
import URL from '../models/url.Model';

// Create Short URL
export const createShortUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { originalUrl, customUrl } = req.body;
    const url = await shortenUrl(originalUrl, customUrl);
    res.status(200).json(url); 
  } catch (error: any) {
    console.error('Error creating short URL:', error);
    res.status(400).json({ error: error.message });
  }
};

// Handle redirection from the short URL
export const getShortUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortUrl } = req.params;
    const url = await URL.findOne({ shortUrl });

    if (!url) {
      res.status(404).json({ error: 'URL not found' });
      return; 
    }

    // Increment the click count for analytics
    url.clicks += 1;
    await url.save();

    // Redirect to the original URL
    res.redirect(url.originalUrl);
  } catch (error: any) {
    console.error('Error redirecting to original URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Generate QR Code for a short URL
export const getQRCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortUrl } = req.params;
    const url = await URL.findOne({ shortUrl });

    if (!url) {
      res.status(404).json({ error: 'URL not found' });
      return; 
    }

    // Generate the QR code
    const qrCodeData = await generateQRCode(shortUrl);
    res.status(200).json({ qrCode: qrCodeData });
  } catch (error: any) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Fetch link history
export const getLinkHistory = async (_req: Request, res: Response): Promise<void> => {
  try {
    const urls = await URL.find();

    // Generate QR code for each URL
    const urlsWithQRCode = await Promise.all(urls.map(async (url) => {
      const qrCodeData = await generateQRCode(url.shortUrl);
      return {
        ...url.toObject(),
        qrCode: qrCodeData
      };
    }));

    res.status(200).json(urlsWithQRCode);
  } catch (error: any) {
    console.error('Error fetching link history:', error);
    res.status(500).json({ error: 'Server error' });
  }
};