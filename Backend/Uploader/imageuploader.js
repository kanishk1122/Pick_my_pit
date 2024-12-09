require('dotenv').config();

async function authorize() {
    const credentials = process.env.GOOGLE_CREDENTIALS;
    const { client_email, private_key } = credentials;
    const jwtClient = new google.auth.JWT(
        client_email,
        null,
        private_key,
        ['https://www.googleapis.com/auth/drive.file']
    );
    await jwtClient.authorize();
    return jwtClient;
}

async function uploadImageToDrive(authClient, file) {
    console.log(file)
    return new Promise((resolve, reject) => {
        const drive = google.drive({ version: 'v3', auth: authClient });
        const fileMetadata = {
            name: `${Date.now()}_${Math.floor(Math.random() * 100 + 1)}`,
            parents: ['1HLRtE1lxC5N3CV_iGFQPWMR9U2StsigW']
        };
        const media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(file.path)
        };
        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        }, (err, file) => {
            if (err) {
                reject(err);
            } else {
                resolve(file.data.id);
            }
        });
    });
}