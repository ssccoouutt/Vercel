export default async function handler(req, res) {
  const COLAB_URL = "https://8000-m-s-2ssqfrj4cy6be-c.us-central1-1.prod.colab.dev";
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const path = req.query.path?.join('/') || '';
    const endpoint = path ? `${COLAB_URL}/${path}` : COLAB_URL;
    
    const response = await fetch(endpoint, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
