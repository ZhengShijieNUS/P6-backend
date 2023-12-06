import multer from 'multer'

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './src/images')
  }, // determine the directory of the uploaded files where to store
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_')
    const extension = MIME_TYPES[file.mimetype]
    callback(null, Date.now() + '.' + extension)
  } // determine how to name the uploaded files
})

export default multer({storage:storage}).single('image')
