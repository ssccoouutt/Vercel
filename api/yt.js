// Single file API - YouTube Downloader
// Deploy to: https://vercel-steel-pi.vercel.app/api/yt

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get the action from query parameter
  const { action, url, format = 'video', quality = '720p' } = req.query;

  // If no action specified, show API info
  if (!action) {
    return res.status(200).json({
      name: "YouTube Downloader API",
      version: "1.0",
      usage: {
        info: "https://vercel-steel-pi.vercel.app/api/yt?action=info&url=YOUTUBE_URL",
        download: "https://vercel-steel-pi.vercel.app/api/yt?action=download&url=YOUTUBE_URL&format=video&quality=720p",
        audio: "https://vercel-steel-pi.vercel.app/api/yt?action=download&url=YOUTUBE_URL&format=audio"
      },
      example: {
        info: "https://vercel-steel-pi.vercel.app/api/yt?action=info&url=https://youtu.be/dQw4w9WgXcQ",
        download: "https://vercel-steel-pi.vercel.app/api/yt?action=download&url=https://youtu.be/dQw4w9WgXcQ"
      }
    });
  }

  // Validate URL
  if (!url) {
    return res.status(400).json({ error: 'YouTube URL is required' });
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    // Handle different actions
    switch (action) {
      case 'info':
        return await getVideoInfo(videoId, res);
      
      case 'download':
        return await getDownloadLink(videoId, url, format, quality, res);
      
      default:
        return res.status(400).json({ error: 'Invalid action. Use "info" or "download"' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message,
      fallback: `Try manual download: https://www.y2mate.com/youtube/${videoId}`
    });
  }
}

// Extract video ID from various YouTube URL formats
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  // Try to extract from URL params
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v');
  } catch {
    return null;
  }
}

// Get video information using oEmbed (no API key required)
async function getVideoInfo(videoId, res) {
  try {
    // Use YouTube oEmbed (free, no key)
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    const data = await response.json();
    
    return res.status(200).json({
      success: true,
      video_id: videoId,
      title: data.title || 'Unknown',
      author: data.author_name || 'Unknown',
      author_url: data.author_url,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnail_sd: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      url: `https://youtu.be/${videoId}`,
      embed_url: `https://www.youtube.com/embed/${videoId}`,
      download_options: {
        video: `https://vercel-steel-pi.vercel.app/api/yt?action=download&url=https://youtu.be/${videoId}&format=video`,
        audio: `https://vercel-steel-pi.vercel.app/api/yt?action=download&url=https://youtu.be/${videoId}&format=audio`
      }
    });
  } catch (error) {
    // Fallback to basic info
    return res.status(200).json({
      success: true,
      video_id: videoId,
      title: `YouTube Video (${videoId})`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      url: `https://youtu.be/${videoId}`,
      note: "Limited info available. Try the download endpoint."
    });
  }
}

// Get download link using public services
async function getDownloadLink(videoId, originalUrl, format, quality, res) {
  // Try multiple services to get download link
  
  // Service 1: y2mate (most reliable)
  try {
    const y2mateUrl = `https://www.y2mate.com/mates/en68/analyze/ajax`;
    
    // First, analyze the video
    const formData = new URLSearchParams();
    formData.append('url', originalUrl || `https://youtu.be/${videoId}`);
    formData.append('ajax', '1');
    
    const analyzeResponse = await fetch(y2mateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: formData.toString()
    });
    
    const analyzeData = await analyzeResponse.json();
    
    if (analyzeData.status === 'ok') {
      // Get video title
      const title = analyzeData.title || `YouTube_${videoId}`;
      
      // Generate direct download links using different services
      const downloadLinks = {
        video: {
          '360p': `https://www.y2mate.com/download.php?vid=${videoId}&q=360`,
          '480p': `https://www.y2mate.com/download.php?vid=${videoId}&q=480`,
          '720p': `https://www.y2mate.com/download.php?vid=${videoId}&q=720`,
          '1080p': `https://www.y2mate.com/download.php?vid=${videoId}&q=1080`
        },
        audio: {
          '128kbps': `https://www.y2mate.com/download.php?vid=${videoId}&q=128`,
          '192kbps': `https://www.y2mate.com/download.php?vid=${videoId}&q=192`,
          '320kbps': `https://www.y2mate.com/download.php?vid=${videoId}&q=320`
        }
      };
      
      // Get the appropriate download link
      let downloadUrl = null;
      if (format === 'audio') {
        downloadUrl = downloadLinks.audio['192kbps'];
      } else {
        downloadUrl = downloadLinks.video[quality] || downloadLinks.video['720p'];
      }
      
      return res.status(200).json({
        success: true,
        video_id: videoId,
        title: title,
        format: format,
        quality: quality,
        download_url: downloadUrl,
        alternative_urls: format === 'audio' ? downloadLinks.audio : downloadLinks.video,
        expires: "Links may expire after 1 hour",
        direct: false,
        instructions: "Click the download_url or copy it to your browser"
      });
    }
  } catch (error) {
    console.log('y2mate failed, trying next service...');
  }
  
  // Service 2: SaveFrom.net
  try {
    const saveFromUrl = `https://en.savefrom.net/api/convert/?url=https://youtu.be/${videoId}`;
    const response = await fetch(saveFromUrl);
    const data = await response.json();
    
    if (data.url) {
      return res.status(200).json({
        success: true,
        video_id: videoId,
        title: data.title || `YouTube_${videoId}`,
        format: format,
        quality: quality,
        download_url: data.url,
        service: 'savefrom.net'
      });
    }
  } catch (error) {
    console.log('SaveFrom failed');
  }
  
  // Service 3: SSYouTube
  try {
    const ssUrl = `https://ssyoutube.com/api/convert?url=https://youtu.be/${videoId}`;
    const response = await fetch(ssUrl);
    const data = await response.json();
    
    if (data.url) {
      return res.status(200).json({
        success: true,
        video_id: videoId,
        title: data.title || `YouTube_${videoId}`,
        format: format,
        quality: quality,
        download_url: data.url,
        service: 'ssyoutube.com'
      });
    }
  } catch (error) {
    console.log('SSYouTube failed');
  }
  
  // Fallback: Return download page URLs
  return res.status(200).json({
    success: true,
    video_id: videoId,
    title: `YouTube Video (${videoId})`,
    format: format,
    quality: quality,
    message: "Direct download link could not be generated. Use these websites:",
    download_pages: {
      y2mate: `https://www.y2mate.com/youtube/${videoId}`,
      savefrom: `https://en.savefrom.net/1-fr/youtube-video-download-${videoId}/`,
      ssyoutube: `https://ssyoutube.com/watch?v=${videoId}`,
      yt1s: `https://yt1s.com/en/watch?v=${videoId}`
    },
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  });
}
