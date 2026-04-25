const Vendor = require('../models/Vendor');
const Booking = require('../models/Booking');

// Get all vendors with filters
exports.getAllVendors = async (req, res) => {
  try {
    const { category, search, minRating, sortBy } = req.query;
    let query = {};

    if (category && category !== 'All Categories') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    let vendors = await Vendor.find(query);

    // Sort by specified field
    if (sortBy === 'rating') {
      vendors.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      vendors.sort((a, b) => b.reviews - a.reviews);
    } else if (sortBy === 'price') {
      vendors.sort((a, b) => a.priceRange.localeCompare(b.priceRange));
    }

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single vendor
exports.getVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Get vendor bookings count
    const bookingsCount = await Booking.countDocuments({ vendorId: vendor._id });
    const responseData = {
      ...vendor.toObject(),
      bookingsCount
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register new vendor
exports.registerVendor = async (req, res) => {
  try {
    const { name, category, description, location, contact, priceRange, availability } = req.body;

    const newVendor = new Vendor({
      name,
      category,
      description,
      location,
      contact,
      priceRange,
      availability,
      userId: req.user.id,
      rating: 0,
      reviews: 0
    });

    await newVendor.save();
    res.status(201).json({ message: 'Vendor registered', vendor: newVendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update vendor profile
exports.updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor updated', vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add review to vendor
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    vendor.reviews.push({
      userId: req.user.id,
      rating,
      comment,
      date: new Date()
    });

    // Update average rating
    const avgRating = vendor.reviews.reduce((sum, r) => sum + r.rating, 0) / vendor.reviews.length;
    vendor.rating = parseFloat(avgRating.toFixed(2));

    await vendor.save();

    res.json({ message: 'Review added', vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor reviews
exports.getVendorReviews = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({
      vendorId: vendor._id,
      vendorName: vendor.name,
      rating: vendor.rating,
      totalReviews: vendor.reviews.length,
      reviews: vendor.reviews.sort((a, b) => new Date(b.date) - new Date(a.date))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor's own profile (for vendor accounts)
exports.getMyVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    const bookings = await Booking.find({ vendorId: vendor._id });
    const activeBookings = bookings.filter(b => b.status === 'confirmed');

    res.json({
      vendor,
      totalBookings: bookings.length,
      activeBookings: activeBookings.length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      revenue: bookings
        .filter(b => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, b) => sum + b.price, 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update availability
exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true }
    );

    res.json({ message: 'Availability updated', vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
