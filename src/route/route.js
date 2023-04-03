const express =require('express')
const router = express.Router()
const {registerValidtion,updateUser} = require('../validation/validation')
const {creatUser,loginUser,getUser,profileUpdate,deleteUseById} =require('../controller/userController')
const {authentication, authorization} =require('../middleware/auth')




// -----------userApi--------

router.post("/register",registerValidtion,creatUser)


router.post("/login",loginUser)

router.get('/user/:userId/profile',authentication, getUser)

router.put("/user/:userId",updateUser,authentication, authorization,profileUpdate)

router.delete("/user/:userId/profile", authentication, authorization,deleteUseById)









module.exports=router
