const fs = require('fs');

const deleteFile = filePath => {
  fs.unlink(filePath, err => {
    if (err) {
      if (err.errno === -4058) return true;
    } else {
      throw err;
      console.error(err);
    }
  });
};
exports.deleteFile = deleteFile;
