
const fileHelper = require('../util/file');
const GeoTags = require('../models/geoTagsModel');

exports.getOneTag = async (req, res) => {
try{
  const geoTagId = req.params.geotagId;
  const geoTags= await GeoTags.findById(geoTagId);
    
      console.log(geoTags);
      res.status(200).json({
        status: 'success',
        data: geoTags
      });
    }
    catch(error) {
      res.status(404).json({
        status: 'Error',
        err: error
      });
    }
};

exports.deleteTag = (req, res) => {
  const geoTagId = req.params.taggedLocationId;
  console.log(geoTagId);
  return GeoTags.findOneAndDelete({geoTagId:geoTagId}, options)
  .then(deletedDocument => {
    if(deletedDocument) {
      console.log(`Successfully deleted document that had the form: ${deletedDocument}.`)
    } else {
      console.log("No document matches the provided query.")
    }
    return deletedDocument
  })
  .catch(err => console.error(`Failed to find and delete document: ${err}`))
};


exports.getManyTags = async (req, res) => {
  try {
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const size = req.query.size ? parseInt(req.query.size) : 10;

    const geoTags = await GeoTags.find().sort({'createdAt': -1}).skip(offset).limit(size);
    console.log(geoTags);
    res.status(200).json( {status: 'success', data: geoTags });
  } catch (error) {
    console.log(error);
    res.json({
      status: 'error',
      error: error
    });
  }
};


exports.postTag = async (req, res) => {
  try{
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const trashScale = req.body.trashScale;

  const picture = req.file;

  const pictureUrl = picture.path;

  console.log(`${latitude}  ${longitude}  ${picture}`);
  console.log('location tag');
  try{
  res.status(200).json({message:'Insertion Successfull'});
  const geoTag = new GeoTags({
    latitude: latitude,
    longitude: longitude,
    trashScale: trashScale,
    photo: pictureUrl
  });
  const geotag= await geoTag.save(); 
      console.log('trash tag created');
      console.log(geotag);
 
}
catch(errr){
  console.log(error);
  res.json({error: errr});
}
  } catch (error) {
    console.log(error);
    res.json({error: error});
  }

};

exports.updateTag = async (req, res) => {
  try{
    const geoTagId = req.params.geotagId;
  const updateTrashScale = req.body.trashScale;

  const geotag= await GeoTags.findById(geoTagId);
      geotag.trashScale = updateTrashScale;
      geotag.save();

        res.status(200).json({
          status: 'success',
          message: 'Geo tag updated',
          data: geotag
        });
    }
    catch(error ) {
      res.status(500).json({
        status: 'data is not found',
        message: 'some error occur in the find by id',
        err: error
      });
     
    }
};
