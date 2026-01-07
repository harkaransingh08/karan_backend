import express from 'express'
import multer from 'multer'

import { create_user } from '../controller/user_controller.js'
const upload = multer({ storage: multer.diskStorage({}) })

const routes = express.Router()


routes.post('/create_user', upload.single('profileImage'), create_user)
export default routes