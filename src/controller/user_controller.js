import User from "../model/user_model.js";
import { userOtpsend } from "../mail/all_mailformate.js";

export const create_user = async (req, res) => {
  try {
    const { email, password } = req.body;

    const randomOtp = Math.floor(1000 + Math.random() * 9000);
    const expiryTime = Date.now() + 5 * 60 * 1000;

    // check existing user
    const checkUser = await User.findOne({ email });

    if (checkUser) {

      if (checkUser.isDeleted) {
        return res.status(200).json({
          status: true,
          msg: "Your account is deleted",
        });
      }

      if (checkUser.isVerified) {
        return res.status(200).json({
          status: true,
          msg: "Account already verified, please login",
        });
      }

      // resend OTP
      checkUser.userOtp = randomOtp;
      checkUser.otpExpire = expiryTime;
      await checkUser.save();

      userOtpsend(checkUser.email, randomOtp);

      return res.status(200).json({
        status: true,
        msg: "OTP resent successfully",
      });
    }

    // create new user
    const newUser = await User.create({
      ...req.body,
      userOtp: randomOtp,
      otpExpire: expiryTime,
    });

    userOtpsend(newUser.email, randomOtp);

    return res.status(201).json({
      status: true,
      msg: "User created successfully",
      userId: newUser._id,
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      msg: err.message,
    });
  }
};
