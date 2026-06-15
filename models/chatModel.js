import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Chat history must belong to a user']
    },
    prompt: {
      type: String,
      required: [true, 'Prompt cannot be empty'],
      trim: true
    },
    response: {
      type: String,
      required: [true, 'Response cannot be empty']
    },
    topic: {
      type: String,
      enum: ['General', 'Math', 'Science', 'Coding', 'History', 'Languages'],
      default: 'General'
    },
    actionType: {
      type: String,
      enum: ['chat', 'explain', 'quiz', 'summarize'],
      default: 'chat'
    }
  },
  {
    timestamps: true
  }
);

// Pre-find hook to populate user details in chat
chatSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email photo'
  });
  next();
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
