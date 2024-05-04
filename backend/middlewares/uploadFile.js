const multer = require('multer');
const fs = require('fs');
const aws = require('aws-sdk');
require('dotenv').config();

const config = process.env;


aws.config.update({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECREAT_ACCESS_KEY,
})

const s3 = new aws.S3({ params: { Bucket: 'twiptyimages' } })

const storage = multer.memoryStorage();
const upload = multer({ storage });

const awsUpload = (fileData, fileKey) => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: 'twiptyimages',
        Key: fileKey,
        Body: fileData.buffer,
      };
  
      s3.upload(params, (err, data) => {
        if (err) {
          console.error('Error uploading to S3:', err);
          reject(err);
        } else {
          // Check if fileData has a 'path' property before attempting to unlink
          if (fileData && fileData.path) {
            fs.unlink(fileData.path, (unlinkErr) => {
              if (unlinkErr) {
                console.error('Error deleting local file:', unlinkErr);
              }
            });
          }
  
          resolve(data.Location);
        }
      });
    });
  };
  


module.exports = { storage, upload, awsUpload };