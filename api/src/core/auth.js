require('dotenv').config()

const tkn = require('./jwt')
const httpStatus = require('http-status')
const User = require('../user/controller')

exports.verifyUserDelete = async (token, userId) => {
    try{
        const decoded = await tkn.verifyToken(token);

        if(decoded.userId == userId){
            Promise.resolve({userId: userId})
        }   else{
            return Promise.reject({
                status: httpStatus.FORBIDDEN,
                message: "User doesn't have permission to access the resource"
            })
        }
    }
    catch(error){
        return Promise.reject({ 
            status: httpStatus.UNAUTHORIZED, 
            message: "Invalid Token"
        })
    }
}

exports.verifyUserProfile = async (token, profile) => {

    try {
        const decoded = await tkn.verifyToken(token);
        
        const user = await User.findByUserIdProf(decoded.userId)

        let correct = profile.includes(user.profile.description)? true : false

        if(correct){
            Promise.resolve({userId: user.id})
        }   else{
            return Promise.reject({
                status: httpStatus.FORBIDDEN,
                message: "User doesn't have permission to access the resource"
            })
        }
    }
    catch(error){
        return Promise.reject({
            status: httpStatus.UNAUTHORIZED,
            message: error.message
        })
    }
}