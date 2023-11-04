const { User } = require("../../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  const { body } = req;

  if (!body.email || !body.password) {
    return res.status(400).json({
      meta: {
        message: "Email and password must be provided",
        code: 400,
        status: "error",
      },
      data: null,
    });
  }

  const user = await User.findOne({
    where: { email: body.email },
  });

  if (!user) {
    return res.status(401).json({
      meta: {
        message:
          "Authentication email failed. Please ensure your email and password are entered correctly.",
        code: 401,
        status: "error",
      },
      data: null,
    });
  }

  const isPasswordCorrect = bcrypt.compareSync(body.password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      meta: {
        message:
          "Authentication password failed. Please ensure your email and password are entered correctly.",
        code: 401,
        status: "error",
      },
      data: null,
    });
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    image_profile: user.image_profile,
  };

  const secret = process.env.JWT_SECRET;

  const expiresIn = 60 * 60 * 1;

  const token = jwt.sign(payload, secret, { expiresIn: expiresIn });

  return res.status(200).json({
    meta: {
      message: "Authentication successful",
      code: 200,
      status: "success",
    },
    data: {
      name: user.name,
      email: user.email,
    },
    token: token,
  });
};
