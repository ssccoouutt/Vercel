// Colab SENDS video to this endpoint
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Receive video from Colab
    const video = req.body;
    
    // Store temporarily (in production use DB)
    if (!global.videos) global.videos = [];
    global.videos.push(video);
    
    return res.status(200).json({ success: true });
  }
  
  // Get list of videos for frontend
  if (req.method === 'GET') {
    return res.status(200).json(global.videos || []);
  }
}
