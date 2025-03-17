import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const UserMediaInteractionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tmdbId: {
      type: Number,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },
    // Track different types of interactions
    watched: {
      status: {
        type: Boolean,
        default: false,
      },
      date: Date,
    },
    liked: {
      status: {
        type: Boolean,
        default: false,
      },
      date: Date,
    },
    watchlisted: {
      status: {
        type: Boolean,
        default: false,
      },
      date: Date,
    },
    rating: {
      score: {
        type: Number,
        min: 0,
        max: 10,
        default: null,
      },
      date: Date,
    },
    // Store additional metadata about the interaction
    watchProgress: {
      type: Number, // Percentage or time in seconds
      default: 0,
    },
    lastWatched: Date,
  },
  { timestamps: true }
);

// Create a compound index to ensure each user has only one interaction document per media item
UserMediaInteractionSchema.index(
  { userId: 1, tmdbId: 1, mediaType: 1 },
  { unique: true }
);

const userModel = mongoose.model("User", userSchema);
const UserMediaInteraction = mongoose.model(
  "UserMediaInteraction",
  UserMediaInteractionSchema
);
export { userModel, UserMediaInteraction };
