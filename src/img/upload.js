import { v2 as cloudinary } from 'cloudinary'
import sharp from 'sharp'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.Api_key,
    api_secret: process.env.Api_secret
})

export const uploadProfileImg = async (filePath) => {
    try {
        const uploadDir = 'uploads'

        if (!fs.existsSync(uploadDir)) {fs.mkdirSync(uploadDir) }

        const outputPath = path.join(  uploadDir, `sharp-${Date.now()}.jpg`)

        await sharp(filePath) .resize(300, 300, { fit: 'cover' }) .sharpen()
            .jpeg({ quality: 85 }) .toFile(outputPath)

        const uploadResult = await cloudinary.uploader.upload(outputPath, { folder: 'profile_images'})
        fs.unlinkSync(outputPath)
        return uploadResult

    } catch (err) {
        console.error('Image upload failed:', err)
        throw err
    }
}   