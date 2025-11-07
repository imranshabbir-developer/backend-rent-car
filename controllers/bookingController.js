import Booking, {
  BOOKING_OPTIONS,
  BOOKING_STATUS,
} from '../models/bookingModel.js';
import Car from '../models/carModel.js';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const SELF_DRIVER_EXTRA_PER_DAY = 500;

const calculateDays = (pickupDate, dropoffDate) => {
  const diff = Math.ceil(
    (dropoffDate.setHours(0, 0, 0, 0) -
      pickupDate.setHours(0, 0, 0, 0)) /
      DAY_IN_MS
  );

  return diff > 0 ? diff : 1;
};

export const createBooking = async (req, res, next) => {
  try {
    const {
      carId,
      customerName,
      email,
      phone,
      address,
      pickupDate,
      dropoffDate,
      bookingOption,
      notes,
    } = req.body;

    if (
      !carId ||
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !pickupDate ||
      !dropoffDate ||
      !bookingOption
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking fields.',
      });
    }

    if (!BOOKING_OPTIONS.includes(bookingOption)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking option selected.',
      });
    }

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Selected car not found.',
      });
    }

    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);

    if (Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pickup or drop-off date.',
      });
    }

    if (dropoff < pickup) {
      return res.status(400).json({
        success: false,
        message: 'Drop-off date cannot be earlier than pick-up date.',
      });
    }

    const totalDays = calculateDays(pickup, dropoff);
    const baseRatePerDay = Number(car.rentPerDay) || 0;
    let extraChargePerDay = 0;

    if (bookingOption === 'self_without_driver') {
      extraChargePerDay = SELF_DRIVER_EXTRA_PER_DAY;
    } else if (bookingOption === 'out_of_station') {
      extraChargePerDay = baseRatePerDay;
    }

    const calculatedTotal =
      totalDays * (baseRatePerDay + extraChargePerDay);

    const booking = await Booking.create({
      car: car._id,
      customerName,
      email,
      phone,
      address,
      pickupDate: pickup,
      dropoffDate: dropoff,
      bookingOption,
      notes,
      pricing: {
        baseRatePerDay,
        extraChargePerDay,
        totalDays,
        calculatedTotal,
      },
    });

    await booking.populate({
      path: 'car',
      select: 'name brand model rentPerDay carPhoto location',
    });

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully.',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'car',
        select: 'name brand model rentPerDay carPhoto location',
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !BOOKING_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status provided.',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate({
      path: 'car',
      select: 'name brand model rentPerDay carPhoto location',
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully.',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    await booking.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};


