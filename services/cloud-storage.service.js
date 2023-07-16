const { Storage } = require('@google-cloud/storage');

const storageConfig = {
  keyFilename: process.env.GOOGLE_CLOUD_STORAGE_FILE_KEY,
  projectId: 'pygusapp',
};

const storage = new Storage(/* storageConfig */);
const bucketName = 'pygus-storage';

exports.getFileUrl = async (directoryPath, fileName) => {
  try {

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(`${directoryPath}/${fileName}`);
    const fileExists = await file.exists();

    if (!fileExists[0]) {
      return '';
    }

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // URL expira em 15 minutos
    });

    return url;
  } catch (error) {
    console.error('Erro ao obter a URL do arquivo:', error);
  }
};
