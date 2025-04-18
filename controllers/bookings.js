const Booking = require("../models/Booking");
const Campground = require("../models/Campground");

//@desc     Get all bookings
//@route    GET /api/v1/bookings
//@access   Public
exports.getBookings = async (req, res, next) => {
  let query;
  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "campground",
      select: "name address telephone",
    });
  } else {
    if (req.params.campgroundId) {
      console.log(req.params.campgroundId);
      query = Booking.find({ campground: req.params.campgroundId }).populate({
        path: "campground",
        select: "name address telephone",
      });
    } else {
      query = Booking.find().populate({
        path: "campground",
        select: "name address telephone",
      });
    }
  }
  try {
    const bookings = await query;
    // Format the response
    const formattedBookings = bookings.map((booking) => ({
      id: booking._id.toString(),
      bookingDate: booking.bookingDate,
      user: booking.user.toString(),
      campground: {
        id: booking.campground._id.toString(),
        name: booking.campground.name,
        address: booking.campground.address,
        tel: booking.campground.telephone,
      },
      createdAt: booking.createdAt,
    }));
    res.status(200).json({
      success: true,
      count: formattedBookings.length,
      data: formattedBookings,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find booking" });
  }
};

//@desc     Get single booking
//@route    GET /api/v1/bookings/:id
//@access   Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "campground",
      select: "name description tel",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to view this booking`,
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc     Add booking
//@route    POST /api/v1/campgrounds/:campgroundId/booking
//@access   Private
exports.addBooking = async (req, res, next) => {
  try {
    req.body.campground = req.params.campgroundId;
    const campground = await Campground.findById(req.params.campgroundId);

    if (!campground) {
      return res.status(404).json({
        success: false,
        message: `No campground with the id of ${req.params.campgroundId}`,
      });
    }

    req.body.user = req.user.id;

    const existedBookings = await Booking.find({ user: req.user.id });

    if (existedBookings.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 bookings`,
      });
    }

    let booking = await Booking.create(req.body);
    // Populate the campground field
    booking = await Booking.findById(booking._id).populate({
      path: "campground",
      select: "name address telephone",
    });
    // Format the response to match the frontend's expected structure
    const formattedBooking = {
      id: booking._id.toString(),
      bookingDate: booking.bookingDate,
      user: booking.user.toString(),
      campground: {
        id: booking.campground._id.toString(),
        name: booking.campground.name,
        address: booking.campground.address,
        tel: booking.campground.telephone, // Match the frontend's expected field name
      },
      createdAt: booking.createdAt,
    };
    res.status(200).json({
      success: true,
      data: formattedBooking,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Booking" });
  }
};
//@desc     Update booking
//@route    POST /api/v1/bookings/:id
//@access   Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`, // Fix the message to reference the correct ID
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // Populate the campground field
    booking = await Booking.findById(booking._id).populate({
      path: "campground",
      select: "name address telephone",
    });
    // Format the response
    const formattedBooking = {
      id: booking._id.toString(),
      bookingDate: booking.bookingDate,
      user: booking.user.toString(),
      campground: {
        id: booking.campground._id.toString(),
        name: booking.campground.name,
        address: booking.campground.address,
        tel: booking.campground.telephone,
      },
      createdAt: booking.createdAt,
    };
    res.status(200).json({
      success: true,
      data: formattedBooking,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Booking" });
  }
};

//@desc     Delete booking
//@route    DELETE /api/v1/bookings/:id
//@access   Private
exports.deleteBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`, // Fix the message
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }

    await booking.deleteOne();
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Booking" });
  }
};

//@desc     Get admin dashboard summary
//@route    GET /api/v1/bookings/dashboard
//@access   Private (Admin only)
exports.getDashboardSummary = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to access the dashboard`,
      });
    }

    const totalBookings = await Booking.countDocuments();

    const bookingSummary = await Booking.aggregate([
      {
        $group: {
          _id: "$campground",
          bookingCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "campgrounds",
          localField: "_id",
          foreignField: "_id",
          as: "campground",
        },
      },
      {
        $unwind: "$campground",
      },
      {
        $project: {
          campgroundId: "$_id",
          campgroundName: "$campground.name",
          bookingCount: 1,
        },
      },
      {
        $sort: {
          bookingCount: -1, // Sort by booking count in descending order
          campgroundName: 1, // Secondary sort by name alphabetically
        },
      },
    ]);

    // Format the response
    const formattedSummary = bookingSummary.map((item) => ({
      campgroundId: item.campgroundId.toString(),
      campgroundName: item.campgroundName,
      bookingCount: item.bookingCount,
    }));

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        bookingSummary: formattedSummary,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot retrieve dashboard summary" });
  }
};
