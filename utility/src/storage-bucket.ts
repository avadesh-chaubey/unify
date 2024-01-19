import { Storage } from '@google-cloud/storage';

// Creates a client
const storage = new Storage({ keyFilename: "key.json" });

export { storage };