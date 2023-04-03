const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');


const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"] || req.headers["X-API-KEY"];
    
        // checking token
    
        if (!token)
          return res
            .status(401)
            .send({ status: false, msg: "token must be present" });
    
        // validating the token
    
        jwt.verify(token, "functionup", (err, decodedtoken) => {
          if (err) {
            let message =
              err.message === "jwt expired"
                ? "token is expired"
                : "token is invalid";
    
            return res.status(401).send({ status: false, message: message });
          }
    
          
    
          req.decodedToken = decodedtoken
    
          next();
        });
      } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
      }
}

const authorization = async function(req, res,next){
    try{    
       const decoded = req.decodedToken
        const userId= req.params.userId
    
        if(userId)
        {
            if(!(userId.match(/^[0-9a-fA-F]{24}$/)))
            return res.status(400).send({status:false,message:"Invalid userId given"})
            
            const user = await userModel.findById(userId)
            
            if(!user)
            return res.status(404).send({status:false,message:"userId not found !"})
    
            if(decoded.userId !== userId.toString())
            return res.status(403).send({status:false,message:"Unauthorised access"})
    
        }else
            return res.status(400).send({status:false,message:"User Id Required"})
    }catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
    next()
    
        }
    
    
    module.exports={authentication, authorization}
