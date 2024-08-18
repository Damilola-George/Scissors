import { Router, Request, Response } from 'express';
import { createShortUrl, getShortUrl, getQRCode, getLinkHistory } from '../controllers/url.Controller';
import { rateLimiterMiddleware } from '../middlewares/rateLimiter';


const router = Router();



// POST route for URL shortening and QR code generation
router.post('/shorten', rateLimiterMiddleware, async (req: Request, res: Response) => {
  try {
    await createShortUrl(req, res);
  } catch (error) {
    console.error('Error in /shorten route:', error);
    res.render('index', { errorMessage: 'Failed to create short URL. Please try again.' });
  }
});

// GET route for link history
router.get('/history', async (req: Request, res: Response) => {
  try {
    await getLinkHistory(req, res);
  } catch (error) {
    console.error('Error in /history route:', error);
    res.status(500).render('index', { errorMessage: 'Failed to fetch link history. Please try again later.' });
  }
});

// GET route for redirection from the short URL
router.get('/:shortUrl', async (req: Request, res: Response) => {
  try {
    await getShortUrl(req, res);
  } catch (error) {
    console.error('Error in /:shortUrl route:', error);
    res.status(500).render('index', { errorMessage: 'Failed to redirect. Please try again later.' });
  }
});

// GET route to serve the QR code for a specific shortened URL
router.get('/qr/:shortUrl', async (req: Request, res: Response) => {
  try {
    await getQRCode(req, res);
  } catch (error) {
    console.error('Error in /qr/:shortUrl route:', error);
    res.status(500).render('index', { errorMessage: 'Failed to generate QR code. Please try again later.' });
  }
});

export default router;