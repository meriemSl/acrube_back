const { createHash } = require("../helper/helper");
const Url = require("../models/Url");



// POST a new url mapping
exports.createUrl = async (req, res) => {
  try {

    const { url } = req.body;
    console.log('url', req.body);
    const existingUrl = await Url.findOne({ originUrl: url });
    if (existingUrl) {
      return res.status(409).json({ message: "URL already shortened", url: existingUrl });
    }

    let hashUrl  = await createHash(url, 3);
    const newShortenUrl = new Url({ originUrl:url, hashUrl: hashUrl });
    await newShortenUrl.save();

    res.status(201).json(newShortenUrl);
  } catch (error) {

    res.status(400).json({ message: "Error creating url shorten" });
  }
};



exports.getOriginUrl = async (req, res) => {
  try {
    console.log('req', req.params.shortened_id);
    const param = req.params.shortened_id;
    const url = await Url.findOne({ hashUrl: param });
    console.log('origin', url);
    res.status(201).json(url);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error getting url shorten" });
  }
};

// GET all items
exports.getItems = async (req, res) => {
  try {
    const Urls = await Url.find();
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
