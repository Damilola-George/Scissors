import request from 'supertest';
import app from '../app'; // 
import { nanoid } from 'nanoid';
import  UrlModel  from '../models/url.Model'; // Assuming you have a URL model


// Test the Url Shortening Functionality
describe('URL Shortening', () => {
  it('should create a shortened URL', async () => {
    const longUrl = 'https://www.example.com/very/long/url';
    const res = await request(app).post('/api/shorten').send({ longUrl });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('shortUrl');

    const shortUrl = res.body.shortUrl;
    const urlDoc = await UrlModel.findOne({ shortUrl });
    expect(urlDoc).toBeDefined();
  });

  
});


// Test the URL redirection functionality 
describe('URL Redirection', () => {
    it('should redirect to the original URL', async () => {
      const longUrl = 'https://www.example.com/very/long/url';
      const shortUrl = nanoid(8); // Generate a random short URL
      await UrlModel.create({ longUrl, shortUrl });
  
      const res = await request(app).get(`/${shortUrl}`).redirects(1);
  
      expect(res.statusCode).toBe(200);
      expect(res.headers.location).toBe(longUrl);
    });
  

  });
  



// Test the custom URL functionality
describe('Custom URL', () => {
    it('should create a shortened URL with a custom alias', async () => {
      const longUrl = 'https://www.example.com/very/long/url';
      const customAlias = 'myshorturl';
      const res = await request(app).post('/api/shorten').send({ longUrl, customAlias });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.shortUrl).toBe(`http://localhost/${customAlias}`);
  
      const urlDoc = await UrlModel.findOne({ shortUrl: customAlias });
      expect(urlDoc).toBeDefined();
    
    });
  
    it('should return an error for an invalid custom alias', async () => {
      const longUrl = 'https://www.example.com/very/long/url';
      const invalidAlias = 'invalid/alias';
      const res = await request(app).post('/api/shorten').send({ longUrl, customAlias: invalidAlias });
  
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Invalid custom alias');
    });
  });
  
  // Test the URL expiration functionality :

  describe('URL Expiration', () => {
    it('should expire the shortened URL after the expiration date', async () => {
      const longUrl = 'https://www.example.com/very/long/url';
      const expirationDate = new Date(Date.now() + 60 * 1000); // 1 minute from now
      const shortUrl = nanoid(8);
      await UrlModel.create({ longUrl, shortUrl, expirationDate });
  
      // Wait for the expiration date to pass
      await new Promise((resolve) => setTimeout(resolve, 61 * 1000));
  
      const res = await request(app).get(`/${shortUrl}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toContain('URL has expired');
    });
  });
  



  
  