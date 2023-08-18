const express = require('express');
const multer = require('multer');
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//config
const IBMCloud = require('ibm-cos-sdk');

const config = {
    region: 'eu-de',
    endpoint: 's3.eu-de.cloud-object-storage.appdomain.cloud',
    apiKeyId: '*****',
    serviceInstanceId: '*****'
};
const cos = new IBMCloud.S3(config);

function uploadFile(bucketName, fileName, fileBody) {
    return cos.putObject({
        Bucket: bucketName,
        Key: fileName,
        Body: fileBody
    }).promise();
}

//create post request for uploading file
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).send('The file is missing.');
        return;
    }

    uploadFile('*****bucket_name*****', file.originalname, file.buffer)
        .then(() => res.status(200).send('The file has been uploaded successfully.'))
        .catch(err => res.status(500).send('File upload error: ' + err.message));
});

app.listen(3000, () => {
    console.log('The server is running on port 3000.');
});
