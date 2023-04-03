const userModel = require("../model/userModel");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')





//-------userRegistration----------------------

const creatUser = async function (req, res) {
    try {
        const data = req.body
        const password = data.password

        const cypt = await bcrypt.hash(password, 10)
        data.password = cypt


        const register = await userModel.create(data)

        return res.status(201).send({ status: true, message: "User Registration successfull", data: register })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
};

// ---------------userLogin--------------

const loginUser = async function (req, res) {
    try {
        email = req.body.email
        myPassword = req.body.password


        if (!email) {
            return res
                .status(400)
                .send({ status: false, message: "please provide an Email !" });
        }

        if (!myPassword) {
            return res
                .status(400)
                .send({ status: false, message: "please enter password !" });
        }

        let user = await userModel.findOne({ email: email })

        if (!user) {
            return res.status(400).send({ status: false, message: "username or Password is not corerct" })
        }

        let checkPass = await bcrypt.compare(myPassword, user.password)
        if (!checkPass) {
            return res.status(400).send({ status: false, message: "bcrypted password is invalid" })
        }


        let token = jwt.sign(
            {
                userId: user._id.toString(),
                organisation: "algo8",
            },
            "functionup",
            { expiresIn: "2h" }
        );
        let Token = {
            userId: user._id.toString(),
            token: token
        }
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, message: "Successfully Login", data: Token });
    }
    catch (err) {
        return res.status(500).send({ message: "server error", error: err.message });
    }
};



const getUser = async function (req, res) {
    try {
        const userId = req.params.userId
        console.log(userId)
        if (!(userId.match(/^[0-9a-fA-F]{24}$/)))
            return res.status(400).send({ status: false, message: "Invalid userId given" })

        const user = await userModel.findById(userId)
        if (!user)
            return res.status(400).send({ status: false, message: "User not Found" })

        return res.status(200).send({ status: true, message: "Success", data: user })
    }
    catch (err) {
        res.status(500).send({ status: false, message: "server error", error: err.message });
    }

}


const profileUpdate = async function (req, res) {
    try {
        const userId = req.params.userId

        console.log(userId)
        const data = req.body

        


        const { password } = data

        if (password)
            data.password = await bcrypt.hash(password, 10)



        const updatedData = await userModel.findOneAndUpdate({ _id: userId }, data, { new: true })
         
        return res.status(200).send({ status: true, message: "updated sucessfully", data: updatedData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: "server error", error: err.message });
    }

}



const deleteUseById = async function (req, res) {
    const userId = req.params.userId

    if (!(userId.match(/^[0-9a-fA-F]{24}$/)))
        return res.status(400).send({ status: false, message: "Invalid userId given" })

    let userDeleted = await userModel.findOneAndUpdate({ _id: userId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
    if (userDeleted) {
        return res.status(200).send({ status: true, message: 'user Deleted successfully' })
    }
    return res.status(404).send({ status: false, message: 'user Not Found or Deleted !' })
}


module.exports = { creatUser, loginUser, getUser, profileUpdate, deleteUseById }