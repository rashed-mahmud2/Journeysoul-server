const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl : {
      type: String,
      default: "/images/avater.jpg"
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    
    // ⚡ Account suspension
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspendedAt: {
      type: Date,
      default: null,
    },
    suspensionReason: {
      type: String,
      default: null,
    },

    // ⚡ Token version to invalidate old tokens
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// check email is taken
userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });

  return !!user;
};

//check if password matched or not
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcryptjs.compare(password, user.password);
};

//hash password before saving the user
userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcryptjs.hash(user.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
