const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },

  password: {
    type: String,
    required: String
  }
});

userSchema.pre("save", function(next) {
  if (!this.isModified("password")) return next();
  const saltRounds = 20;
  bcrypt
    .hash(this.password, saltRounds)
    .then(hash => {
      this.password = hash;
      return next();
    })
    .catch(err => {
      return next(err);
    });
});

const User = mongoose.model("User", userSchema);

module.exports = User;