const Vendor = require('../models/Vendor');
const Booking = require('../models/Booking');

function normalizePriceTier(pricing) {
  if (!pricing || typeof pricing.minBudget !== 'number') return '$$';
  if (pricing.minBudget <= 1000) return '$';
  if (pricing.minBudget <= 5000) return '$$';
  return '$$$';
}

function mapVendor(vendorDoc) {
  const vendor = vendorDoc.toObject();
  return {
    ...vendor,
    name: vendor.businessName,
    rating: vendor.averageRating || 0,
    reviewsCount: Array.isArray(vendor.reviews) ? vendor.reviews.length : 0,
    city: vendor.location?.city || '',
    priceRange: normalizePriceTier(vendor.pricing)
  };
}

// Get all vendors with filters
exports.getAllVendors = async (req, res) => {
  try {
    const { category, search, minRating, sortBy, city, priceRange, availableOn } = req.query;
    const query = {};

    if (category && category !== 'all' && category !== 'All Categories') {
      query.category = category.toLowerCase();
    }

    if (city && city !== 'all') {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let vendors = await Vendor.find(query);
    let mapped = vendors.map(mapVendor);

    if (minRating) {
      const floor = Number(minRating);
      mapped = mapped.filter((v) => v.rating >= floor);
    }

    if (priceRange && priceRange !== 'all') {
      mapped = mapped.filter((v) => v.priceRange === priceRange);
    }

    if (availableOn) {
      const selectedDate = new Date(availableOn);
      mapped = mapped.filter((v) => {
        const availability = v.availability || {};
        const start = availability.startDate ? new Date(availability.startDate) : null;
        const end = availability.endDate ? new Date(availability.endDate) : null;
        const bookedDates = Array.isArray(availability.bookedDates)
          ? availability.bookedDates.map((date) => new Date(date).toDateString())
          : [];

        if (start && selectedDate < start) return false;
        if (end && selectedDate > end) return false;
        return !bookedDates.includes(selectedDate.toDateString());
      });
    }

    if (sortBy === 'rating') {
      mapped.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      mapped.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'price') {
      mapped.sort((a, b) => a.priceRange.length - b.priceRange.length);
    } else if (sortBy === 'name') {
      mapped.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json(mapped);
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
    const responseData = { ...mapVendor(vendor), bookingsCount };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register new vendor
exports.registerVendor = async (req, res) => {
  try {
    const { name, businessName, category, description, location, contact, pricing, availability } = req.body;

    const newVendor = new Vendor({
      businessName: businessName || name,
      category,
      description,
      location,
      contact,
      pricing,
      availability,
      userId: req.user.id,
      averageRating: 0
    });

    await newVendor.save();
    res.status(201).json({ message: 'Vendor registered', vendor: mapVendor(newVendor) });
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
      createdAt: new Date()
    });

    // Update average rating
    const avgRating = vendor.reviews.reduce((sum, r) => sum + r.rating, 0) / vendor.reviews.length;
    vendor.averageRating = parseFloat(avgRating.toFixed(2));

    await vendor.save();

    res.json({ message: 'Review added', vendor: mapVendor(vendor) });
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
      rating: vendor.averageRating,
      totalReviews: vendor.reviews.length,
      reviews: vendor.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
        .reduce((sum, b) => sum + (b.finalPrice || b.quotedPrice || 0), 0)
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
