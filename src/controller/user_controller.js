import user_model from '../model/user_model.js'
import { userOtpsend } from '../mail/all_mailformate.js'
import { error } from '../error/errorHandling.js'

export const create_user = async (req, res) => {
  try {
    const data = req.body
    const { email } = data

    const randomOtp = Math.floor(1000 + Math.random() * 9000)
    const expiryTime = Date.now() + 5 * 60 * 1000

    const checkUser = await user_model.findOne({ email })

    if (checkUser) {
      const { isVerify, isDelete } = checkUser.user || {}

      if (isDelete) {
        return res.status(200).send({
          status: true,
          msg: "Your account is deleted"
        })
      }

      if (isVerify) {
        return res.status(200).send({
          status: true,
          msg: "Account already verified, please login"
        })
      }

      await user_model.updateOne(
        { email },
        {
          $set: {
            "user.userOtp": randomOtp,
            "user.otpExpire": expiryTime
          }
        }
      )

      userOtpsend(checkUser.email, checkUser.name, randomOtp)

      return res.status(200).send({
        status: true,
        msg: "Resend OTP sent"
      })
    }

    // NEW USER
    data.user = {
      userOtp: randomOtp,
      otpExpire: expiryTime,
      isVerify: false,
      isDelete: false
    }

    const DB = await user_model.create(data)
    userOtpsend(DB.email, DB.name, randomOtp)

    const UserDB = {
      name: DB.name,
      email: DB.email
    }

    return res.status(201).send({
      status: true,
      msg: "Successfully created user",
      UserDB
    })
  } catch (err) {
    error(err, res)
  }
}
