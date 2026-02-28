// api/download.js - This uses YOUR Colab URL (hidden from users)
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 👇 YOUR COLAB URL (hardcoded here - never exposed to users)
  const COLAB_URL = "https://a1b2c3d4-8000.colab.googleusercontent.com"; // <-- CHANGE THIS
  
  try {
    const { url, format } = req.body;
    
    // Forward the request to Colab
    const response = await fetch(`${COLAB_URL}/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, format })
    });
    
    const data = await response.json();
    
    // Send back to user
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
