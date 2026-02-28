// api/colab-webhook.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET request - show info
  if (req.method === 'GET') {
    return res.status(200).json({
      name: "Colab Webhook Endpoint",
      status: "active",
      endpoints: {
        "POST /api/colab-webhook": "Send data from Colab",
        "GET /api/colab-webhook": "This info message"
      },
      example: {
        "message": "your data here",
        "model_output": "results",
        "timestamp": "2024-01-01"
      }
    });
  }

  // POST request - receive data from Colab
  if (req.method === 'POST') {
    try {
      const data = req.body;
      
      // Log received data (Vercel logs will show this)
      console.log("📥 Received from Colab:", data);
      
      // Process the data (your logic here)
      const response = {
        success: true,
        received_at: new Date().toISOString(),
        message: "Data received successfully by Vercel!",
        your_data: data,
        processed: {
          message_length: data.message?.length || 0,
          data_type: typeof data,
          timestamp: Date.now()
        }
      };

      // You can store this in a database, send emails, etc.
      
      return res.status(200).json(response);
      
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  // Handle other methods
  return res.status(405).json({ error: "Method not allowed" });
}
