const express = require('express')
const mail = require('nodemailer');
const bcrypt = require('bcryptjs');
const router = express.Router()
const User = require('../database/models/user')
const passport = require('../passport')


// forgot password API
router.post('/coinbase/api/forgot', function (req, res) {
    req = req.body;
    User.find({ username: req.username }, function (err, result) {
        if (result.length == 0) {
            console.log("email not exist");
            res.send({
                status: "failure",
                data: result,
                error: ""
            })
        } else {
            var mailobj = mail.createTransport({
                service: 'gmail',
                auth: {
                    user: 'democoinbase@gmail.com',
                    pass: 'coinbase@123'
                }
            });
            mailobj.sendMail({
                from: 'democoinbase@gmail.com',
                to: req.username,
                subject: "Reset Password",
                html: '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="background-color: #0c1e42;padding: 30px"><table><tr><th><h1 style="color:white;text-align:center;">Coinebase</h1></th></tr><tr><th>&nbsp;</th></tr></table><div style="background-color: white;margin: 0 auto;border-radius: 10px;"><table><tr><th style="text-align:center;color:white">Coinebase</th></tr></table><table style="margin: 0 auto;"><tr style="padding:50px;"><th>Hi, ' + result[0].firstname + '</th></tr><tr><td>&nbsp;</td></tr><tr><td &nbsp;</td></tr><tr><td style="text-align: center;font: size 10px;">You recently requested to reset your Coinbase account password.</td></tr><tr><td>&nbsp;</td></tr><tr><td>&nbsp;</td></tr> <tr><td style="text-align: center;"><button style="background-color: #0c1e42; padding:20px;color: white;border-radius: 10px;font-size:20px;"><a style="color:white;text-decoration: none;" href="http://ec2-18-209-34-30.compute-1.amazonaws.com/resetpwd?uid=' + result[0]._id + '">Reset Password</a></button></td></tr><tr><td>&nbsp;</td></tr><tr><td>&nbsp;</td></tr><tr><td style="text-align: center;">To receive more help on this issue, please contact our Support Team by replying directly to thismessage.</td></tr><tr><td>&nbsp;</td></tr><tr><td></td></tr></table></div><div><p style="color:white;text-align:center;">&copy;2018 Coinebase</p></div></body></html>'
            }, async (err, result) => {
                if (err) {
                    console.log(err)
                    return res.json({
                        status: "error",
                        data: [],
                        error: ""
                    })
                } else {
                    console.log(result)
                }
            })
            res.send({
                status: "success",
                data: result,
                error: ""
            })
        }
    });
})


// user signup API
router.post('/coinbase/api/register', (req, res) => {
    console.log('user signup');
    const { firstname, lastname, username, password } = req.body
    // ADD VALIDATION
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.send({
                error: `Sorry, already a user with the username: ${username}`
            })
        }
        else {
            const newUser = new User({
                firstname: firstname,
                lastname: lastname,
                username: username,
                password: password
            })
            newUser.save((err, savedUser) => {
                if (err) return res.json(err)
                res.send(savedUser)
            })
            sendingEmail(username, 'Coinbase',firstname)
        }
    })
})

function sendingEmail(email, subject,name) {
    var mailobj = mail.createTransport({
        service: 'gmail',
        auth: {
            user: 'democoinbase@gmail.com',
            pass: 'coinbase@123'
        }
    });
    mailobj.sendMail({
        from: 'democoinbase@gmail.com',
        to: email,
        subject: subject,
        html: '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="background-color: #0c1e42;padding: 30px"><table><tr><th><h1 style="color:white;text-align:center;">Coinebase</h1></th></tr><tr><th>&nbsp;</th></tr></table><div style="background-color: white;margin: 0 auto;border-radius: 10px;"><table><tr><th style="text-align:center;color:white">Coinebase</th></tr></table><table style="margin: 0 auto;"><tr style="padding:50px;"><th><h1>Hi, ' + name + '</h1></th></tr><tr><td>&nbsp;</td></tr><tr><td &nbsp;</td></tr><tr><td style="text-align: center;font: size 10px;"><h2>Thanks for the Subscription.You will be get the access to our services.Enjoy the Subscription.</h2></td></tr><tr><td>&nbsp;</td></tr><tr><td>&nbsp;</td></tr> <tr><td></td></tr><tr><td>&nbsp;</td></tr><tr><td>&nbsp;</td></tr><tr><td></td></tr></table></div><div><p style="color:white;text-align:center;">&copy;2018 Coinebase</p></div></body></html>'
    }, async (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result)
        }
    })
}

//  user login API
router.post('/coinbase/api/login',
    function (req, res, next) {
        console.log('routes/user.js, login, req.body: ');
        console.log(req.body)
        next()
    },
    passport.authenticate('local'),
    (req, res) => {
        console.log('logged in', req.user);
        var userInfo = {
            username: req.user.username
        };
        res.send(userInfo);
    }
)


// user password reset
router.post('/coinbase/api/reset', function (req, res) {
    console.log('routes/user.js, reset password req.body');
    console.log(req.body)
    data = req.body
    var pwd = bcrypt.hashSync(data.newpassword, 10);
    console.log("pass" + pwd)
    User.update({ _id: data.uid }, { $set: { password: pwd } }, function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log("success")
        var userInfo = {
            data: "success"
        };
        res.send(userInfo)
    })
})

//  getting user data API
router.get('/coinbase/api/getUserDetails', (req, res, next) => {
    console.log('===== user!!======')
    console.log(req.user)
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
})

//  user logout API
router.post('/coinbase/api/logout', (req, res) => {
    if (req.user) {
        req.logout()
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
})

module.exports = router