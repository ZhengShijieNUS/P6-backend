import Sauce from '../models/sauce.js'
import fs from 'fs'

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
    res.status(200).json(
      sauce
    )
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
  const url = req.protocol + '://' + req.get('host')
  const sauce = new Sauce({
    userId: reqJson.userId,
    name: reqJson.name,
    manufacturer: reqJson.manufacturer,
    description: reqJson.description,
    mainPepper: reqJson.mainPepper,
    imageUrl: url + '/src/images/' + req.file.filename,
    heat: reqJson.heat
  })

  try {
    const newSauce = await sauce.save()

    if (!newSauce) {
      throw new Error('Create new sauce failed')
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

export async function updateSauce (req, res, next) {
  const url = req.protocol + '://' + req.get('host')

 
  let newSauce = await Sauce.findOne({ _id: req.params.id })
  console.log(req.body)
  
  const reqJson = req.body
  if (req.file) {
    newSauce = {
      userId: reqJson.userId,
      name: reqJson.name,
      manufacturer: reqJson.manufacturer,
      description: reqJson.description,
      mainPepper: reqJson.mainPepper,
      imageUrl: url + '/src/images/' + req.file.filename,
      heat: reqJson.heat,
     
    }
  } else {
    newSauce = {
      userId: reqJson.userId,
      name: reqJson.name,
      manufacturer: reqJson.manufacturer,
      description: reqJson.description,
      mainPepper: reqJson.mainPepper,
      imageUrl: reqJson.imageUrl,
      heat: reqJson.heat,
     
    }
  }

  try {

    const result = await Sauce.findOneAndUpdate({ _id: req.params.id }, newSauce)
    
    res.status(200).json({
      message: 'Sauce updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

export async function deleteSauce (req, res, next) {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id })

    if (!sauce) {
      throw new Error("The sauce doesn't exist")
    }

    if (sauce.userId !== req.params.userId) {
      throw new Error(
        'You are not the owner of the sauce, please change the user accordingly.'
      )
    }

    const filename = sauce.imageUrl.split('/images/')[1]
    fs.unlink('src/images/' + filename, async () => {
      try {
        await Sauce.deleteOne({ _id: req.params.id })

        res.status(200).json({
          message: 'The sauce is successfully deleted'
        })
      } catch (error) {
        res.status(400).json({
          error: error.message
        })
      }
    })
  } catch (err) {
    res.status(400).json({
      error: err.message
    })
  }
}

export async function setLikeStatus (req, res, next) {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id })

    if (!sauce) {
      throw new Error("The sauce doesn't exist")
    }

    const userId = req.body.userId
    const likeStatus = req.body.like

    const likeArray = sauce.usersLiked
    const dislikesArray = sauce.usersDisliked

    let newSauce

    if (likeArray.includes(userId)) {
      if (likeStatus === 1) {
        //no change needed
        res.status(200).json({
          message: 'User has liked the sauce'
        })
      } else if (likeStatus === -1) {
        newSauce = new sauce({
          userId: sauce.userId,
          name: sauce.name,
          manufacturer: sauce.manufacturer,
          description: sauce.description,
          mainPepper: sauce.mainPepper,
          imageUrl: sauce.imageUrl,
          heat: sauce.heat,
          like: sauce.like - 1,
          dislikes: sauce.dislikes + 1,
          usersLiked: sauce.usersLiked.splice(likeArray.indexOf(userId), 1),
          usersDisliked: sauce.usersDisliked.push(userId)
        })
      } else {
        newSauce = new sauce({
          userId: sauce.userId,
          name: sauce.name,
          manufacturer: sauce.manufacturer,
          description: sauce.description,
          mainPepper: sauce.mainPepper,
          imageUrl: sauce.imageUrl,
          heat: sauce.heat,
          like: sauce.like - 1,
          dislikes: sauce.dislikes,
          usersLiked: sauce.usersLiked.splice(likeArray.indexOf(userId), 1),
          usersDisliked: sauce.usersDisliked
        })
      }
    } else if (dislikesArray.includes(userId)) {
      if (likeStatus === -1) {
        res.status(200).json({
          message: 'User has disliked the sauce'
        })
      } else if (likeStatus === 1) {
        newSauce = new sauce({
          userId: sauce.userId,
          name: sauce.name,
          manufacturer: sauce.manufacturer,
          description: sauce.description,
          mainPepper: sauce.mainPepper,
          imageUrl: sauce.imageUrl,
          heat: sauce.heat,
          like: sauce.like + 1,
          dislikes: sauce.dislikes - 1,
          usersLiked: sauce.usersLiked.push(userId),
          usersDisliked: sauce.usersDisliked.splice(likeArray.indexOf(userId), 1)
        })
      } else {
        newSauce = new sauce({
          userId: sauce.userId,
          name: sauce.name,
          manufacturer: sauce.manufacturer,
          description: sauce.description,
          mainPepper: sauce.mainPepper,
          imageUrl: sauce.imageUrl,
          heat: sauce.heat,
          like: sauce.like,
          dislikes: sauce.dislikes - 1,
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked.splice(likeArray.indexOf(userId), 1)
        })
      }
    } else {
      if (likeStatus === 1) {
        newSauce = new sauce({
          userId: sauce.userId,
          name: sauce.name,
          manufacturer: sauce.manufacturer,
          description: sauce.description,
          mainPepper: sauce.mainPepper,
          imageUrl: sauce.imageUrl,
          heat: sauce.heat,
          like: sauce.like + 1,
          dislikes: sauce.dislikes,
          usersLiked: sauce.usersLiked.push(userId),
          usersDisliked: sauce.usersDisliked
        })
      } else if (likeStatus === -1) {
        newSauce = new sauce({
          userId: sauce.userId,
          name: sauce.name,
          manufacturer: sauce.manufacturer,
          description: sauce.description,
          mainPepper: sauce.mainPepper,
          imageUrl: sauce.imageUrl,
          heat: sauce.heat,
          like: sauce.like,
          dislikes: sauce.dislikes + 1,
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked.push(userId)
        })
      } else {
        res.status(200).json({
          message: 'User has no status changed on their likes or dislikes'
        })
      }
    }

    await Sauce.updateOne({ _id: req.params.id }, newSauce)

    res.status(200).json({
      message: "User's like status has changed"
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}
