//@desc   GET all campgrounds
//@route  GET /api/v1/campgrounds
//@access Public
exports.getCampgrounds = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Show all campgrounds' });
};

//@desc   GET single campground
//@route  GET /api/v1/campgrounds/:id
//@access Public
exports.getCampground = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Show campground ${req.params.id}` });
};

//@desc   Create new campground
//@route  POST /api/v1/campgrounds
//@access Private
exports.createCampground = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Create new campground' });
};

//@desc   UPDATE campground
//@route  PUT /api/v1/campgrounds/:id
//@access Private
exports.updateCampground = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Update campground ${req.params.id}` });
};

//@desc   DELETE campground
//@route  DELETE /api/v1/campgrounds/:id
//@access Private
exports.deleteCampground = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Delete campground ${req.params.id}` });
};
