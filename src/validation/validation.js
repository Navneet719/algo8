const userModel = require('../model/userModel')


// Validataion for empty request body
const checkBody = function (value) {
    if (Object.keys(value).length === 0) return false;
    else return true;
};

const isValidBody = function (value) {
    if (typeof value === "undefined" || value === "null") return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};

const isValidEmail = function (email) {
    let checkemail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (checkemail.test(email)) {
        return true;
    }
    return false;
};



const isValidMobileNumber = function (mobile) {
    let checkMobile = /^[6-9]\d{9}$/;
    if (checkMobile.test(mobile)) {
        return true;
    }
    return false;
};

const isValidPassword = function (password) {
    const re =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,15}$/; //for password space not allowed, also handles !password
    return re.test(password);
};


// Validation for length of characters
const lengthOfCharacter = function (value) {
    if (!/^\s*(?=[a-zA-Z])[\a-z\A-Z\s]{3,64}\s*$/.test(value)) return false;
    else return true;
};





//======================================User registration validation====================================================
const registerValidtion = async function (req, res, next) {
    try {
        let data = req.body
        let { fname, lname, email, phone, password, } = data
       

        if (!checkBody(data)) {
            return res.status(400).send({ status: false, message: "Please input Parameters" })
        }

        if (!isValidBody(fname)) {
            return res.status(400).send({ status: false, message: "Please provide first name" })
        }
        if (!lengthOfCharacter(fname)) {
            return res.status(400).send({ status: false, message: "Please provide first name with right format" })
        }

        if (!isValidBody(lname)) {
            return res.status(400).send({ status: false, message: "Please provide last name" })
        }
        if (!lengthOfCharacter(lname)) {
            return res.status(400).send({ status: false, message: "Please provide last name with right format" })
        }

        if (email)
            email = email.toLowerCase()
        if (!isValidBody(email)) {
            return res.status(400).send({ status: false, message: "Please enter email" })
        }
        else if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Email is not valid" })
        }
        const existEmail = await userModel.findOne({ email });
        if (existEmail) {
            return res.status(400).send({ status: false, message: "This Email is already in use" })
        }

        if (!phone) {
            return res.status(400).send({ status: false, message: "Please enter mobile number" })
        }
        if (!isValidMobileNumber(phone)) {
            return res.status(400).send({ status: false, message: "Please enter 10 digit indian number, eg. +91 9876xxxxxx" })
        }
        const existPhone = await userModel.findOne({ phone });
        if (existPhone) {
            return res.status(400).send({ status: false, message: "This Mobile number is already in use" })
        }
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Please enter valid password  and length should be 8 to 15" })
        }

      

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
    next()
}

const updateUser = async function (req, res, next) {
    try{
        let userId = req.params.userId
        let data = req.body
        let { fname, lname, email, phone, password } = data

        if (!(userId.match(/^[0-9a-fA-F]{24}$/)))
      return res.status(400).send({ status: false, message: "Invalid userId given" })

      if (!checkBody(data)) {
        return res.status(400).send({ status: false, message: "Please input Parameters" })
      }

      if (fname) {
        if (!isValidBody(fname)) {
          return res.status(400).send({ status: false, message: "Enter valid firstName" });
        }
        if (!lengthOfCharacter(fname)) {
          return res.status(400).send({ status: false, message: "Please provide first name with right format" })
        }
      }
  
      if (lname) {
        if (!isValidBody(lname)) {
          return res.status(400).send({ status: false, message: "Please provide last name" })
        }
        if (!lengthOfCharacter(lname)) {
          return res.status(400).send({ status: false, message: "Please provide last name with right format" })
        }
      }
  
      if (email) {
        email = email.toLowerCase()
        if (!isValidBody(email)) {
          return res.status(400).send({ status: false, message: "Please enter email" })
        }
        else if (!isValidEmail(email)) {
          return res.status(400).send({ status: false, message: "Email is not valid" })
        }
        const existEmail = await userModel.findOne({ email });
        if (existEmail) {
          return res.status(400).send({ status: false, message: `${(email)}This Email is already in use` })
        }
      }
  
      if (phone) {
        if (!isValidMobileNumber(phone)) {
          return res.status(400).send({ status: false, message: "Please enter 10 digit indian number, eg. +91 9876xxxxxx" })
        }
        const existPhone = await userModel.findOne({ phone });
        if (existPhone) {
          return res.status(400).send({ status: false, message: `${phone}This Mobile number is already in use` })
        }
      }
      if (password) {
        if (!isValidPassword(password)) {
          return res.status(400).send({ status: false, message: "Please enter valid password  and length should be 8 to 15" })
        }
      }

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
      }
      next()
}



module.exports ={registerValidtion,isValidRequestBody,updateUser}
