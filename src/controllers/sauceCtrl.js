import Sauce from '../models/sauce.js'

export async function getAllSauces (req, res, next) {
  try {
    const allSauce = await Sauce.find()
    res.status(200).json(allSauce)
  } catch (err) {
    res.status(400).json({
      error: err.message
    })
  }
}

export async function getOneSauce (req, res, next) {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id })
    if (!sauce) {
      throw new Error("The sauce doesn't exist")
    }
    res.status(200).json({
      sauce
    })
  } catch (err) {
    res.status(400).json({
      error: err.message
    })
  }
}

export async function createSauce (req, res, next) {
// covert the body.sauce to jsonand use it 
// rebuild the url for imageUrl 

    const reqJson = JSON.parse(req.body.sauce)
    const url = req.protocol + '://' + req.get('host');
    const sauce = new Sauce({
        userId:reqJson.userId,
        name: reqJson.name,
        manufacturer: reqJson.manufacturer,
        description: reqJson.description,
        mainPepper: reqJson.mainPepper,
        imageUrl: url + '/src/images/' + req.file.filename,
        heat: reqJson.heat,
        likes:0,
        dislikes:0,
    })

    try {
      const newSauce = await sauce.save()

      if(!newSauce){
        throw new Error("Create new sauce failed")
      }

      res.status(200).json({
        message: 'Sauce created and saved successfully'
      })
    } catch (err) {
        res.status(400).json({
            error: err.message
        })
    }

}