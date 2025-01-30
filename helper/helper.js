const crypto = require('crypto');

exports.createHash = async (data, len) => {
      return crypto.createHash("shake256", { outputLength: len })
        .update(data)
        .digest("hex");
  }

