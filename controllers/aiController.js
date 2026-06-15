import { GoogleGenerativeAI } from '@google/generative-ai';
import Chat from '../models/chatModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import * as factory from './handlerFactory.js';

export const askStudyBuddy = catchAsync(async (req, res, next) => {
  const { prompt, topic, actionType } = req.body;

  if (!prompt) {
    return next(new AppError('Please provide a prompt!', 400));
  }

  // Fallback check if the Gemini API Key is empty or standard placeholder
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    const mockResponse = `[SYSTEM NOTICE: Gemini API Key not set. Showing simulated study response.]

Here is a study helper response for your prompt: "${prompt}" (Topic: ${topic || 'General'}, Action: ${actionType || 'chat'}):
1. **Focus Area**: Always break down the problem into smaller sub-tasks.
2. **Key Terms**: Note down definitions and create summaries of major concepts.
3. **Practice**: Test yourself with mock questions to strengthen recall.

*To activate live, real-time Gemini AI chat capabilities, please configure a valid GEMINI_API_KEY in backend/config/config.env and restart the server.*`;

    const newChat = await Chat.create({
      user: req.user._id,
      prompt,
      response: mockResponse,
      topic: topic || 'General',
      actionType: actionType || 'chat'
    });

    return res.status(200).json({
      status: 'success',
      data: {
        chat: newChat
      }
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    // Fetch past chat history for context (limit to 10 messages for token usage efficiency)
    const pastChats = await Chat.find({ user: req.user._id })
      .sort({ createdAt: 1 })
      .limit(10);

    const history = [];
    pastChats.forEach(chat => {
      // Format messages in role-parts blocks suitable for Gemini
      history.push({ role: 'user', parts: [{ text: chat.prompt }] });
      history.push({ role: 'model', parts: [{ text: chat.response }] });
    });

    // Start conversational session with memory
    const chatSession = model.startChat({ history });
    const result = await chatSession.sendMessage(prompt);
    const aiResponseText = result.response.text();

    // Save prompt and response to Mongoose DB
    const newChat = await Chat.create({
      user: req.user._id,
      prompt,
      response: aiResponseText,
      topic: topic || 'General',
      actionType: actionType || 'chat'
    });

    res.status(200).json({
      status: 'success',
      data: {
        chat: newChat
      }
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return next(new AppError(`Gemini AI service failed: ${error.message}`, 502));
  }
});

// Retrieve chat history for the logged-in user
export const getMyChatHistory = catchAsync(async (req, res, next) => {
  const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: chats.length,
    data: {
      chats
    }
  });
});

// Get AI metrics for dashboard (questions asked, popular topics)
export const getAIMetrics = catchAsync(async (req, res, next) => {
  const user = req.user._id;

  const totalQuestions = await Chat.countDocuments({ user });
  const mathQuestions = await Chat.countDocuments({ user, topic: 'Math' });
  const scienceQuestions = await Chat.countDocuments({ user, topic: 'Science' });
  const codingQuestions = await Chat.countDocuments({ user, topic: 'Coding' });
  const historyQuestions = await Chat.countDocuments({ user, topic: 'History' });
  const languageQuestions = await Chat.countDocuments({ user, topic: 'Languages' });
  const generalQuestions = await Chat.countDocuments({ user, topic: 'General' });

  res.status(200).json({
    status: 'success',
    data: {
      totalQuestions,
      byTopic: {
        Math: mathQuestions,
        Science: scienceQuestions,
        Coding: codingQuestions,
        History: historyQuestions,
        Languages: languageQuestions,
        General: generalQuestions
      }
    }
  });
});

// Clear all chats for current user
export const deleteChatHistory = catchAsync(async (req, res, next) => {
  await Chat.deleteMany({ user: req.user._id });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Admin-level queries
export const getAllChatsAdmin = factory.getAll(Chat);
export const deleteChatAdmin = factory.deleteOne(Chat);
