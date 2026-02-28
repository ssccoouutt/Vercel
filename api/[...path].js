// ONE file - put this in your Vercel api folder
export default async function handler(req, res) {
  // Your Colab URL
  const COLAB_URL = "https://8000-m-s-2ssqfrj4cy6be-c.us-central1-1.prod.colab.dev";
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Get the path (everything after /api/)
    const path = req.query.path?.join('/') || '';
    
    // Forward to Colab
    const response = await fetch(`${COLAB_URL}/${path}`, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    // Check if response is JSON or HTML
    const text = await response.text();
    
    try {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } catch {
      // If HTML, send as HTML
      res.setHeader('Content-Type', 'text/html');
      res.status(response.status).send(text);
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
