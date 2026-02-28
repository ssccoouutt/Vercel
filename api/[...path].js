// api/[...path].js - This forwards ALL requests to your Colab URL
export default async function handler(req, res) {
  // 👇 YOUR COLAB URL FROM ABOVE
  const COLAB_URL = "https://8000-m-s-2ssqfrj4cy6be-c.us-central1-1.prod.colab.dev";
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Get the path (e.g., 'download' from /api/download)
    const path = req.query.path?.join('/') || '';
    
    // Build full URL to Colab
    const colabEndpoint = `${COLAB_URL}/${path}`;
    
    console.log(`Proxying to: ${colabEndpoint}`);
    
    // Forward the request to Colab
    const response = await fetch(colabEndpoint, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    // Get response data
    const data = await response.json();
    
    // Send back to user
    res.status(response.status).json(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
