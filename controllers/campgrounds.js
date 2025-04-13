const Campground = require("../models/Campground");

//@desc   GET all campgrounds
//@route  GET /api/v1/campgrounds
//@access Public
// controllers/campgrounds.js
exports.getCampgrounds = async (req, res, next) => {
  try {
    const campgrounds = await Campground.find();
    const formattedCampgrounds = campgrounds.map((campground) => ({
      id: campground._id.toString(), // Convert ObjectId to string and rename to 'id'
      name: campground.name,
      address: campground.address,
      tel: campground.tel,
    }));
    res.status(200).json({
      success: true,
      count: formattedCampgrounds.length,
      data: formattedCampgrounds,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Cannot find campgrounds" });
  }
};

//@desc   GET single campground
//@route  GET /api/v1/campgrounds/:id
//@access Public
exports.getCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);

    if (!campground) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: campground });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc   Create new campground
//@route  POST /api/v1/campgrounds
//@access Private
exports.createCampground = async (req, res, next) => {
  const campground = await Campground.create(req.body);
  console.log(req.body);
  res.status(200).json({
    success: true,
    data: campground,
  });
};

//@desc   UPDATE campground
//@route  PUT /api/v1/campgrounds/:id
//@access Private
exports.updateCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!campground) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: campground });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc   DELETE campground
//@route  DELETE /api/v1/campgrounds/:id
//@access Private
exports.deleteCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findByIdAndDelete(req.params.id);

    if (!campground) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
