import {create_user} from '../controller/user_controller.js'

import express from 'express'

const routes = express.Router()


routes.post('/create_user',create_user)
export default routes