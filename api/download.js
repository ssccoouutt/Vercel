// api/download.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    // Just acknowledge receipt - Colab will handle the actual download
    console.log('Download requested for:', url);
    
    res.status(200).json({ 
      success: true, 
      message: 'Download started in Colab' 
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
