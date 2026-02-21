import multer from 'multer'

const storage = multer.memoryStorage()

const uploadFiles = multer({storage}).array("files", 10);

export default uploadFiles;