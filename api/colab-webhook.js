export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Store downloads in memory (resets on Vercel restart)
  if (!global.downloads) global.downloads = [];
  
  // POST from Colab - receive video
  if (req.method === 'POST') {
    const data = req.body;
    const id = Date.now().toString();
    global.downloads.push({ id, ...data });
    return res.status(200).json({ 
      success: true, 
      id,
      url: `https://vercel-steel-pi.vercel.app/api/webhook?id=${id}`
    });
  }
  
  // GET request - return video info or list
  if (req.method === 'GET') {
    const { id } = req.query;
    
    // Return specific video
    if (id) {
      const video = global.downloads.find(d => d.id === id);
      if (!video) return res.status(404).json({ error: 'Not found' });
      
      // Return video data
      const videoData = video.file_data;
      delete video.file_data; // Don't send file data in JSON
      
      return res.json({ ...video, download_url: `/api/webhook?id=${id}&download=true` });
    }
    
    // Return list of videos (without file data)
    return res.json(global.downloads.map(({ file_data, ...rest }) => rest));
  }
  
  // Handle file download
  if (req.method === 'GET' && req.query.download === 'true') {
    const video = global.downloads.find(d => d.id === req.query.id);
    if (!video || !video.file_data) return res.status(404).json({ error: 'Not found' });
    
    const buffer = Buffer.from(video.file_data, 'base64');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${video.filename}"`);
    return res.send(buffer);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
