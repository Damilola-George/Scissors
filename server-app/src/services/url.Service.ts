import UrlModel, { IURL } from '../models/url.Model';
import { isValidUrl } from '../utils/validation';
import shortid from 'shortid';
import NodeCache from 'node-cache';
import QRCode from 'qrcode';

// Cache with a standard TTL of 100 seconds and a check period of 120 seconds
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

// Shorten a URL
export const shortenUrl = async (originalUrl: string, customUrl?: string): Promise<IURL> => {
  console.log(`Received request to shorten URL: ${originalUrl} with custom URL: ${customUrl}`);

  // Validate the URL
  if (!isValidUrl(originalUrl)) {
    console.error('Invalid URL');
    throw new Error('Invalid URL');
  }

  // Check if URL is cached
  let url = cache.get<IURL>(originalUrl);

  // If the URL is not cached, generate a new short URL
  if (!url) {
    const shortUrl = customUrl || shortid.generate();

    url = new UrlModel({
      originalUrl,
      shortUrl,
      customUrl,
    });

    // Save the URL in the database
    try {
      await url.save();
      cache.set(originalUrl, url);
      console.log(`URL saved to database: ${JSON.stringify(url)}`);
    } catch (error) {
      console.error('Error saving URL to the database', error);
      throw new Error('Error saving URL to the database');
    }
  } else {
    console.log(`URL retrieved from cache: ${JSON.stringify(url)}`);
  }

  return url;
};

// Generate a QR code from a URL
export const generateQRCode = async (url: string): Promise<string> => {
  console.log(`Received request to generate QR code for URL: ${url}`);

  try {
    const qrCodeData = await QRCode.toDataURL(url);
    console.log('QR code generated successfully');
    return qrCodeData;
  } catch (error) {
    console.error('Error generating QR code', error);
    throw new Error('Error generating QR code');
  }
};