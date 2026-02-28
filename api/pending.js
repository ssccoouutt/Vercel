// api/pending.js - Tracks download requests
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Store pending URLs (in production, use a database)
  if (!global.pending) global.pending = [];
  if (!global.processing) global.processing = [];
  
  // GET - return pending URLs for Colab
  if (req.method === 'GET') {
    // Return URLs that aren't being processed yet
    const newUrls = global.pending.filter(url => !global.processing.includes(url));
    
    // Mark them as processing
    global.processing = [...global.processing, ...newUrls];
    
    return res.status(200).json(newUrls);
  }
  
  // POST - add new URL from website
  if (req.method === 'POST') {
    const { url } = req.body;
    
    if (!global.pending.includes(url)) {
      global.pending.push(url);
    }
    
    return res.status(200).json({ success: true });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
      }
