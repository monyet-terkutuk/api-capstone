require("dotenv").config();
const { User } = require("../../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Anda perlu mengimpor modul jwt

module.exports = async (req, res) => {
  const { body } = req;

  if (!body.name || !body.email || !body.password) {
    return res.status(400).json({
      code: 400,
      status: "error",
      data: {
        error: "All required fields must be provided!",
      },
    });
  }

  const isEmailUsed = await User.findOne({
    where: { email: body.email },
  });

  if (isEmailUsed) {
    return res.status(400).json({
      code: 400,
      status: "error",
      data: {
        error: "Email has been used",
      },
    });
  }

  const password = bcrypt.hashSync(body.password, 10);

  try {
    const user = await User.create({ ...body, password });
    return res.json({
      code: 200,
      status: "success",
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      data: error.message,
    });
  }
};
