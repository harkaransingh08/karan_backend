import user_model from '../model/user_model.js'
import { userOtpsend } from '../mail/all_mailformate.js'
import { error } from '../error/errorhandling.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

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
                return res.status(200).send({
                    status: true, msg: "resend otp send ...",
                    id: checkUser._id, name: checkUser.name, email: checkUser.email,
                })
            }
        }

        data.user = { otpExpire: expiryTime, userOtp: randomOtp }


        const DB = await user_model.create(data)
        userOtpsend(data.email, data.name, randomOtp)


        return res.status(201).send({
            status: true, msg: "SucessFull Create User",
            id: DB._id, name: DB.name, email: DB.email,
        })
    }
    catch (err) { error(err, res) }
}

export const user_verify_otp = async (req, res) => {
    try {
        const { id } = req.params;
        const { otp } = req.body;

        if (!otp) { return res.status(400).json({ success: false, message: "OTP is required." }); }

        const user = await user_model.findById(id);
        if (!user) { return res.status(404).json({ success: false, message: "User not found." }); }
        const { userOtp, otpExpire, isVerify } = user.user;

        if (isVerify) { return res.status(409).json({ success: false, message: "Account is already verified. Please login." }); }

        if (Date.now() > otpExpire) { return res.status(410).json({ success: false, message: "OTP has expired. Please request a new OTP." }); }

        if (String(otp) !== String(userOtp)) { return res.status(401).json({ success: false, message: "Invalid OTP." }); }

        await user_model.findOneAndUpdate({ _id: id },
            { $set: { 'user.isVerify': true, 'user.userOtp': null, 'user.otpExpire': null } },
        )

        return res.status(200).json({ success: true, message: "Account verified successfully. You may now login." });

    }
    catch (err) { return error(err, res); }
};


export const user_login = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email) return res.status(400).send({ status: false, msg: "Email is Required" })
        if (!password) return res.status(400).send({ status: false, msg: "Password is Required" })

        const checkUser = await user_model.findOne({ email: email, 'user.isDelete': false })
        if (!checkUser) return res.status(404).send({ status: false, msg: "User not found Pls Sign Up Account" })

        if (!(checkUser.user.isVerify)) return res.status(400).send({ status: false, msg: "Account not Verify pls Verify Otp" })
        const comparePass = await bcrypt.compare(password, checkUser.password)

        if (!comparePass) return res.status(400).send({ status: false, msg: "Wrong Password" })

        const token = await jwt.sign({ id: checkUser._id }, process.env.UserJWT, { expiresIn: '1d' })
        const DB = {
            name: checkUser.name,
            email: checkUser.email,
            id: checkUser._id,
        }
        res.status(200).send({ status: true, msg: "Login Successfull", token, DB })
    }
    catch (err) { return error(err, res); }
};
