export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, format } = req.body;
    
    // Forward to Colab - URL is NOT here, it's in Colab code!
    // Colab will PUSH to this endpoint instead
    
    res.status(200).json({ 
      success: true, 
      message: "Request received, Colab will process" 
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
