export default async function handler(req, res) {
  // Your Colab URL
  const COLAB_URL = "https://8000-m-s-2ssqfrj4cy6be-c.us-central1-1.prod.colab.dev";
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Get the full path
    const path = req.query.path?.join('/') || '';
    
    // Build the URL properly
    let colabUrl = COLAB_URL;
    if (path) {
      colabUrl = `${COLAB_URL}/${path}`;
    }
    
    console.log(`Forwarding to: ${colabUrl}`);
    
    // Forward the request
    const response = await fetch(colabUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    // Get the response
    const data = await response.text();
    
    // Set content type
    res.setHeader('Content-Type', response.headers.get('content-type') || 'text/html');
    res.status(response.status).send(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}
