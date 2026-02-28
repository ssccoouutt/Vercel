export default async function handler(req, res) {
  // 👇 Your current Colab URL
  const COLAB_URL = "https://8000-m-s-4zrgxb3ctbq2-a.asia-east1-2.prod.colab.dev/";
  
  try {
    // Get the path
    const path = req.query.path?.join('/') || '';
    
    // Forward to Colab
    const response = await fetch(`${COLAB_URL}/${path}`, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    // Return response
    const data = await response.text();
    res.setHeader('Content-Type', response.headers.get('content-type') || 'text/html');
    res.status(response.status).send(data);
    
  } catch (error) {
    // Send error as JSON
    res.status(500).json({ error: error.toString() });
  }
}
