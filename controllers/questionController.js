import Question, { QUESTION_STATUS } from '../models/questionModel.js';
import Car from '../models/carModel.js';

export const createQuestion = async (req, res, next) => {
  try {
    const { carId, customerName, email, phone, subject, message } = req.body;

    if (!customerName || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required question fields.',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.',
      });
    }

    // If carId is provided, validate it exists
    let car = null;
    if (carId) {
      car = await Car.findById(carId);
      if (!car) {
        return res.status(404).json({
          success: false,
          message: 'Selected car not found.',
        });
      }
    }

    const question = await Question.create({
      car: carId || undefined,
      customerName,
      email,
      phone,
      subject,
      message,
      status: 'pending',
    });

    if (car) {
      await question.populate({
        path: 'car',
        select: 'name brand model rentPerDay carPhoto location',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Question submitted successfully.',
      data: { question },
    });
  } catch (error) {
    next(error);
  }
};

export const getQuestions = async (req, res, next) => {
  try {
    const { status, carId } = req.query;
    const query = {};

    if (status) {
      if (!QUESTION_STATUS.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid question status provided.',
        });
      }
      query.status = status;
    }

    if (carId) {
      query.car = carId;
    }

    const questions = await Question.find(query)
      .populate({
        path: 'car',
        select: 'name brand model rentPerDay carPhoto location',
      })
      .populate({
        path: 'answeredBy',
        select: 'name email',
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: { questions },
    });
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate({
        path: 'car',
        select: 'name brand model rentPerDay carPhoto location',
      })
      .populate({
        path: 'answeredBy',
        select: 'name email',
      });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { question },
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuestionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, answer } = req.body;

    if (status && !QUESTION_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question status provided.',
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (answer) updateData.answer = answer;
    if (status === 'answered' && answer) {
      updateData.answeredBy = req.user?._id;
      updateData.answeredAt = new Date();
    }

    const question = await Question.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate({
        path: 'car',
        select: 'name brand model rentPerDay carPhoto location',
      })
      .populate({
        path: 'answeredBy',
        select: 'name email',
      });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Question updated successfully.',
      data: { question },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    await question.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Question deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

