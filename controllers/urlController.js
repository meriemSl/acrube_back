const { createHash } = require("../helper/helper");
const Url = require("../models/url");



// POST a new url mapping
exports.createUrl = async (req, res) => {
  try {
    const { urlInput } = req.body;
    const existingUrl = await Url.findOne({ originUrl: urlInput });
    if (existingUrl) {
      return res.status(409).json({ message: "URL already shortened", url: existingUrl });
    }
    let hashUrl  = await createHash(urlInput, 3);
  
    const newShortenUrl = new Url({ originUrl: urlInput, hashUrl: hashUrl });
    
    await newShortenUrl.save();

    res.status(201).json(newShortenUrl);
  } catch (error) {

    res.status(400).json({ message: "Error creating url shorten" });
  }
};



// GET the original URL
exports.getOriginUrl = async (req, res) => {
  try {
    console.log('req', req.params.shortened_id);
    const param = req.params.shortened_id;
    const url = await Url.findOne({ hashUrl: param });
    console.log('url', url);
    if (url) {
      res.send(`
        <html>
            <head>
                <title>Redirecting...</title>
                <script>
                    window.location.href = "${url.originUrl}";
                </script>
            </head>
            <body>
                <p>Redirecting to <a href="${url.originUrl}">${url.originUrl}</a>...</p>
            </body>
        </html>
    `);
    } else {
        res.status(404).json({ message: 'URL not found' });
    }
  } catch (error) {
    res.status(400).json({ message: "Error getting url shorten" });
  }
};

// GET all urls
exports.getItems = async (req, res) => {
  try {
    const Urls = await Url.find();
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
