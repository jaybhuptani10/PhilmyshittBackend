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
    profilePicture: {
      type: String,
      default: null, // Default to null if no profile picture is uploaded
    },
    mediaInteractions: [
      {
        tmdbId: {
          type: Number,
          required: true,
        },
        mediaType: {
          type: String,
          enum: ["movie", "tv"],
          required: true,
        },
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
        watchProgress: {
          type: Number,
          default: 0,
        },
        lastWatched: Date,
      },
    ],
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
export { userModel };
