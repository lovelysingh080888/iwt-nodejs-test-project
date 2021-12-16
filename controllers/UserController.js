var User = require("../models/User");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

const Mail = require("../mail/SendMail");

// validate user ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
exports.validate = (method, req) => {
    switch (method) {
        case "register": {
            var errors = [];
            var status = true;
            const { name, email, password, confirm_password, phone } = req.body;

            if (name == "") {
                status = false;
                errors.push("Name is required");
            }
            if (email == "") {
                status = false;
                errors.push("Name is required");
            }
            if (password == "") {
                status = false;
                errors.push("Password is required");
            }
            if (confirm_password == "") {
                status = false;
                errors.push("Confirm password required");
            }
            if (password !== confirm_password) {
                status = false;
                errors.push("confirm password not matching to password");
            }
            return { status: status, errors: errors };
        }
        case "login": {
            return [
                body("email", "Invalid email").exists().isEmpty().isEmail(),
                body("password").exists().isEmpty(),
            ];
        }
    }
};
// user signup :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

exports.register = async (req, res) => {
    try {
        var error = this.validate("register", req);
        console.log(error);
        if (error.status) {
            // checking for existing user
            User.findOne({ email: req.body.email })
                .exec()
                .then((user) => {
                    if (user != null) {
                        res.json({ errors: "User already exist", status: false });
                    }
                })
                .catch((err) => {
                    res.json({ errors: err, status: false });
                });
            // hashing password
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.status(404).json({ status: false, error: err });
                } else {
                    var user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        phone: req.body.phone,
                        is_active: req.body.is_active,
                    });
                    user.save()
                        .then((user) => {
                            Mail.sendMail(user);
                            res.status(201).json({
                                status: true,
                                user: user,
                                message: "Successfully Registered",
                            });
                        })
                        .catch((err) =>console.log(err));
                }
            });
        } else {
            console.log(error);
            res.json({ errors: error, status: false });
        }
    } catch (error) {
        console.log(error);
    }
};

// user login:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
exports.login = (req, res) => {
    const { email, password } = req.body;
    User.find({ email: email })
        .exec()
        .then((user) => {
            if (user.length < 1) {
                res.status(200).json({ message: "Invalid email or password" });
            } else {
                bcrypt.compare(
                    password.toString(),
                    user[0].password.toString(),
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.json({
                                status: false,
                                error: err,
                                message: "Invalid email or password",
                            });
                        }
                        if (result) {
                            var token = jwt.sign(
                                {
                                    id: user[0]._id,
                                    name: user[0].name,
                                    email: user[0].email,
                                    phone: user[0].phone,
                                    is_active: user[0].is_active,
                                    password: user[0].password,
                                },
                                "paynami secret key",
                                { expiresIn: "7d" }
                            );
                            console.log(token);
                            res.status(201).json({
                                status: true,
                                message: "Successfully Login",
                                token: token,
                                user: user,
                            });
                        }
                    }
                );
            }
        })
        .catch((err) => {
            res.json({ error: err, status: false });
        });
};
