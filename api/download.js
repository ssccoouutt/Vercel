// api/download.js - Called by website
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    // Add to pending queue
    const response = await fetch(`${req.headers.origin}/api/pending`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Download started in Colab' 
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
