import user_model from '../model/user_model.js'
import { userOtpsend } from '../mail/all_mailformate.js'
export const create_user = async (req, res) => {
    try {
        const data = req.body

        const { email } = data

        const randomOtp = Math.floor(1000 + Math.random() * 9000)
        const expiryTime = Date.now() + 5 * 60 * 1000;

        const checkUser = await user_model.findOneAndUpdate({ email: email },
            { $set: { 'user.userOtp': randomOtp, 'user.otpExpire': expiryTime } })

        if (checkUser) {
            const { isVerify, isDelete } = checkUser.user

            if (isDelete) return res.status(200).send({ status: true, msg: "Your Account is Delete" })
            if (isVerify) return res.status(200).send({ status: true, msg: "accosunt already verify pls login..." })
            if (!isVerify) {
                userOtpsend(checkUser.email, checkUser.name, randomOtp)
                return res.status(200).send({ status: true, msg: "resend otp send ..." })
            }
        }

        const DB = await user_model.create(data)
        userOtpsend(data.email, data.name, randomOtp)

        return res.status(201).send({ status: true, msg: "SucessFull Create User", DB })
    }
    catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}  