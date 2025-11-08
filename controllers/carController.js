import Car from '../models/carModel.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all cars
// @route   GET /api/v1/cars
// @access  Public
export const getAllCars = async (req, res, next) => {
  try {
    const { status, category, brand, city, isAvailable, isFeatured } = req.query;

    // Build query object
    const query = {};
    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }
    if (brand) {
      query.brand = brand;
    }
    if (city) {
      query['location.city'] = city;
    }
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    const cars = await Car.find(query)
      .populate('category', 'name description')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cars.length,
      data: {
        cars,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single car by ID
// @route   GET /api/v1/cars/:id
// @access  Public
export const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('category', 'name description')
      .populate('createdBy', 'name email');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        car,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new car
// @route   POST /api/v1/cars
// @access  Private/Admin
export const createCar = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      model,
      year,
      category,
      rentPerDay,
      rentPerHour,
      currency,
      depositAmount,
      isAvailable,
      status,
      city,
      address,
      transmission,
      fuelType,
      seats,
      mileage,
      color,
      registrationNumber,
    } = req.body;

    // Check if car with same registration number already exists
    const carExists = await Car.findOne({ registrationNumber: registrationNumber?.toUpperCase() });

    if (carExists) {
      // Delete uploaded files if car already exists
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          const filePath = path.join(__dirname, '../uploads/cars', file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Car with this registration number already exists',
      });
    }

    const { isFeatured } = req.body;

    // Build car object
    const carData = {
      name,
      brand,
      model,
      year: Number(year),
      category,
      rentPerDay: Number(rentPerDay),
      rentPerHour: rentPerHour ? Number(rentPerHour) : undefined,
      currency,
      depositAmount: depositAmount ? Number(depositAmount) : 0,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isFeatured: isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : false,
      status: status || 'available',
      location: {
        city,
        address,
      },
      transmission,
      fuelType,
      seats: Number(seats),
      mileage: mileage ? Number(mileage) : undefined,
      color,
      registrationNumber: registrationNumber.toUpperCase(),
      createdBy: req.user._id,
    };

    // Handle multiple images
    if (req.files && req.files.length > 0) {
      // Set first image as carPhoto (for backward compatibility)
      carData.carPhoto = `/uploads/cars/${req.files[0].filename}`;
      // Add all images to gallery array
      carData.gallery = req.files.map((file) => `/uploads/cars/${file.filename}`);
    } else if (req.body.carPhoto) {
      // Fallback: if single carPhoto is provided in body (backward compatibility)
      carData.carPhoto = req.body.carPhoto;
      if (!carData.gallery || carData.gallery.length === 0) {
        carData.gallery = [req.body.carPhoto];
      }
    }

    const car = await Car.create(carData);

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: {
        car,
      },
    });
  } catch (error) {
    // Delete uploaded files if error occurs
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const filePath = path.join(__dirname, '../uploads/cars', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    next(error);
  }
};

// @desc    Update car
// @route   PUT /api/v1/cars/:id
// @access  Private/Admin
export const updateCar = async (req, res, next) => {
  try {
    const carId = req.params.id;

    let car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    const {
      name,
      brand,
      model,
      year,
      category,
      rentPerDay,
      rentPerHour,
      currency,
      depositAmount,
      isAvailable,
      isFeatured,
      status,
      city,
      address,
      transmission,
      fuelType,
      seats,
      mileage,
      color,
      registrationNumber,
    } = req.body;

    // Check if registration number is being changed and if it's already taken
    if (registrationNumber && registrationNumber.toUpperCase() !== car.registrationNumber) {
      const regExists = await Car.findOne({
        registrationNumber: registrationNumber.toUpperCase(),
        _id: { $ne: carId },
      });
      if (regExists) {
        // Delete uploaded files if registration already exists
        if (req.files && req.files.length > 0) {
          req.files.forEach((file) => {
            const filePath = path.join(__dirname, '../uploads/cars', file.filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });
        }
        return res.status(400).json({
          success: false,
          message: 'Registration number already exists',
        });
      }
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (brand) updateData.brand = brand;
    if (model) updateData.model = model;
    if (year) updateData.year = Number(year);
    if (category) updateData.category = category;
    if (rentPerDay) updateData.rentPerDay = Number(rentPerDay);
    if (rentPerHour !== undefined) updateData.rentPerHour = Number(rentPerHour);
    if (currency) updateData.currency = currency;
    if (depositAmount !== undefined) updateData.depositAmount = Number(depositAmount);
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (status) updateData.status = status;
    if (transmission) updateData.transmission = transmission;
    if (fuelType) updateData.fuelType = fuelType;
    if (seats) updateData.seats = Number(seats);
    if (mileage !== undefined) updateData.mileage = Number(mileage);
    if (color) updateData.color = color;
    if (registrationNumber) updateData.registrationNumber = registrationNumber.toUpperCase();

    // Handle location
    if (city || address) {
      updateData.location = {
        ...car.location.toObject(),
        ...(city && { city }),
        ...(address && { address }),
      };
    }

    // Handle multiple images update
    if (req.files && req.files.length > 0) {
      // Handle existing gallery images deletion if new images are uploaded
      // Only delete if user is replacing all images (we'll preserve existing if not replacing)
      const newGallery = req.files.map((file) => `/uploads/cars/${file.filename}`);
      
      // If existingGallery is provided in body, merge with new images
      // Otherwise, replace with new images
      if (req.body.existingGallery) {
        try {
          const existingGallery = JSON.parse(req.body.existingGallery);
          updateData.gallery = [...existingGallery, ...newGallery];
        } catch (e) {
          updateData.gallery = newGallery;
        }
      } else {
        // Delete old gallery images if replacing
        if (car.gallery && car.gallery.length > 0) {
          car.gallery.forEach((imgPath) => {
            const oldFilePath = path.join(__dirname, '..', imgPath);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          });
        }
        // Delete old carPhoto if exists
        if (car.carPhoto) {
          const oldFilePath = path.join(__dirname, '..', car.carPhoto);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        updateData.gallery = newGallery;
      }
      
      // Set first image as carPhoto (for backward compatibility)
      updateData.carPhoto = newGallery[0];
    } else if (req.body.existingGallery) {
      // If no new files but existingGallery is provided, update gallery from body
      try {
        const existingGallery = JSON.parse(req.body.existingGallery);
        updateData.gallery = existingGallery;
        if (existingGallery.length > 0 && !updateData.carPhoto) {
          updateData.carPhoto = existingGallery[0];
        }
      } catch (e) {
        // Invalid JSON, ignore
      }
    }

    car = await Car.findByIdAndUpdate(carId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('category', 'name description')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      data: {
        car,
      },
    });
  } catch (error) {
    // Delete uploaded files if error occurs
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const filePath = path.join(__dirname, '../uploads/cars', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    next(error);
  }
};

// @desc    Delete car
// @route   DELETE /api/v1/cars/:id
// @access  Private/Admin
export const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Delete associated photo files
    if (car.carPhoto) {
      const filePath = path.join(__dirname, '..', car.carPhoto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Delete gallery images
    if (car.gallery && car.gallery.length > 0) {
      car.gallery.forEach((imgPath) => {
        const filePath = path.join(__dirname, '..', imgPath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await Car.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle car availability
// @route   PATCH /api/v1/cars/:id/availability
// @access  Private/Admin
export const toggleCarAvailability = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    car.isAvailable = !car.isAvailable;
    car.status = car.isAvailable ? 'available' : 'inactive';
    await car.save();

    res.status(200).json({
      success: true,
      message: `Car ${car.isAvailable ? 'marked as available' : 'marked as unavailable'}`,
      data: {
        car,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update car status
// @route   PATCH /api/v1/cars/:id/status
// @access  Private/Admin
export const updateCarStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['available', 'booked', 'maintenance', 'inactive'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: available, booked, maintenance, inactive',
      });
    }

    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    car.status = status;
    car.isAvailable = status === 'available';
    await car.save();

    res.status(200).json({
      success: true,
      message: `Car status changed to ${status}`,
      data: {
        car,
      },
    });
  } catch (error) {
    next(error);
  }
};

