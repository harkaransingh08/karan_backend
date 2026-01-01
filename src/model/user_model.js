import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema ({

    name : {
        type:String , Trim:true ,  unique:true , required:[true,'Email is Required'],lowercase: true,
        validate: [validwmail, 'Invalid Email']
    },
    password:{
        type: string , trim : true , required:[true,'Password is required'],
        validate : [validpassword , 'Invalid Password give one UpperCase, one LowerCase, one Number and one Special Character']
    },
    user:{
        isDelete:{type:Boolean , default:false},
        otpExpire:{type:Number , default:0},
        isVerify:{type:Boolean , default:false},
        userOtp:{type:Number , default:null, trim : true},
    },
})

userSchema.pre('save',async function (){
   this.password = await bcrypt.hash(this.password, 10)
})

export default mongoose.model('usedsrs', userSchema)