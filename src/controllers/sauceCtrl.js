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

export async function deleteSauce(req, res, next) {
  try {
    const sauceId = req.params.id;
    const userId = req.userId; //userId is set and passed through auth middleware

    const sauce = await Sauce.findById(sauceId);

    if (!sauce) {
      return res.status(404).json({ message: "Sauce not found" });
    }

    if (sauce.userId !== userId) {
      return res.status(403).json({
        message: 'You are not authorized to delete this sauce.'
      });
    }

    const filename = sauce.imageUrl.split('/images/')[1];

    fs.unlink(`src/images/${filename}`, async (err) => {
      if (err) {
        // Handle file deletion error
        return res.status(500).json({ error: 'Error deleting image file' });
      }

      await Sauce.findByIdAndDelete(sauceId);
      res.status(200).json({ message: 'Sauce successfully deleted' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function setLikeStatus(req, res, next) {
  try {
    const sauceId = req.params.id;
    const { userId, like } = req.body;

    const sauce = await Sauce.findById(sauceId);
    if (!sauce) {
      return res.status(404).json({ message: "Sauce not found" });
    }

    let update = {};

    if (like === 1) { // User likes the sauce
      if (!sauce.usersLiked.includes(userId)) {
        update = {
          $inc: { likes: 1 },
          $push: { usersLiked: userId },
          $pull: { usersDisliked: userId }
        };
      }
    } else if (like === -1) { // User dislikes the sauce
      if (!sauce.usersDisliked.includes(userId)) {
        update = {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: userId },
          $pull: { usersLiked: userId }
        };
      }
    } else { // User is canceling their like/dislike
      if (sauce.usersLiked.includes(userId)) {
        update = {
          $inc: { likes: -1 },
          $pull: { usersLiked: userId }
        };
      } else if (sauce.usersDisliked.includes(userId)) {
        update = {
          $inc: { dislikes: -1 },
          $pull: { usersDisliked: userId }
        };
      }
    }

    if (Object.keys(update).length > 0) {
      await Sauce.findByIdAndUpdate(sauceId, update);
      res.status(200).json({ message: "User's like status updated" });
    } else {
      res.status(200).json({ message: "No changes to user's like status" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
