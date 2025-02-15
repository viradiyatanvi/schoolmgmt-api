const Admin=require('../../../models/AdminModels');

const Faculty=require('../../../models/FacultyModel');

const bcrypt=require('bcrypt');

const jwt=require('jsonwebtoken');

const nodemailer = require('nodemailer');
const passport = require('passport');

module.exports.adminregister=async(req,res)=>{
    try{
        // console.log(req.body);
        let checkemailexit=await Admin.findOne({email:req.body.email});
        if(!checkemailexit){
            if(req.body.password==req.body.confirmpassword){
                req.body.password=await bcrypt.hash(req.body.password,10);
                let admindata=await Admin.create(req.body);
                if(admindata){
                    return res.status(200).json({msg:"record added successfully",record:admindata});
                }
                else{
                    return res.status(200).json({msg:"record not added"});
                }
            }
            else{
                return res.status(200).json({msg:"password and confirm password are not match"});
            }
        }
        else{
            return res.status(200).json({msg:"email allready exist"});
        }
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

module.exports.adminLogin=async(req,res)=>{
    try{
        let checkemail=await Admin.findOne({email:req.body.email});
        if(checkemail){
            let checkpassword=await bcrypt.compare(req.body.password,checkemail.password)
            if(checkpassword){
                checkemail=checkemail.toObject();
                delete checkemail.password; 
                console.log("delete",checkemail);
                let admintoken=await jwt.sign({admindata:checkemail},"RNW",{expiresIn:1000*60*60});
                if(admintoken){
                    return res.status(200).json({msg:"data added successfully",admintoken:admintoken});
                }
                else{
                    return res.status(200).json({msg:"data not added"});
                }
            }
            else{
                return res.status(200).json({msg:"invalid password"});
            }
        }
        else{
            return res.status(200).json({msg:"invalid email"});
        }
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

module.exports.adminprofile=async(req,res)=>{
    try{
        return res.status(200).json({msg:"user information",data:req.user});
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

module.exports.admineditprofile=async(req,res)=>{
    try{
        // console.log(req.params.id)
        // console.log(req.body)
        let checkadminid=await Admin.findById(req.params.id);
        if(checkadminid){
            let editadmin=await Admin.findByIdAndUpdate(req.params.id,req.body);
            if(editadmin){
                let updateprofile=await Admin.findById(req.params.id);
                return res.status(200).json({msg:"data update profile",data:updateprofile});
            }
            else{
                return res.status(200).json({msg:"data not update"});
            }
        }
        else{
            return res.status(200).json({msg:"data not found"});
        }
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

module.exports.changepassword=async(req,res)=>{
    try{
        let checkcurrentpassword=await bcrypt.compare(req.body.currentpassword,req.user.password);
        if(checkcurrentpassword){
            if(req.body.currentpassword!=req.body.newpassword){
                if(req.body.newpassword==req.body.confirmpassword){
                    req.body.password=await bcrypt.hash(req.body.newpassword,10)
                    let updatepassword=await Admin.findByIdAndUpdate(req.user._id,req.body);
                    if(updatepassword){
                        return res.status(200).json({msg:"password change successfully",data:updatepassword});
                    }
                    else{
                        return res.status(200).json({msg:"password not match"});
                    }
                }
                else{
                    return res.status(200).json({msg:"newpassword and confirmpassword are not match"});
                }
            }
            else{
                return res.status(200).json({msg:"currentpassword and newpassword match try another"});
            }
        }
        else{
            return res.status(200).json({msg:"invalid password"});
        }
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

module.exports.adminlogout=async(req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                return res.status(400).json({msg:"something is wrong"});
            }
            else{
                return res.status(200).json({msg:"logout successfully"});
            }
        })
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

module.exports.checkemail=async(req,res)=>{
    try{
        let checkemail=await Admin.findOne({email:req.body.email});
        if(checkemail){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "viradiyatanvi028@gmail.com",
                  pass: "synjakrzfpluksse",
                },
                tls:{
                    rejectUnauthorized:false
                }
              });

              let otp=(Math.floor(Math.random()*10000))

              const info = await transporter.sendMail({
                from: 'viradiyatanvi028@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "your login details", // Subject line
                html: `<b>OTP:${otp}</b>`, // html body
              });

              console.log("Message sent");

              const data={
                email:req.body,otp
              }
              if(info){
                return res.status(200).json({msg:"otp send successfully",data:data});
              }
              else{
                return res.status(200).json({msg:"otp not send",data:info});
              }
        }
        else{
            return res.status(200).json({msg:"invalid email",errors:err});
        }
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

module.exports.updatepassword=async(req,res)=>{
    try{
        let checkemail=await Admin.findOne({email:req.query.email});
        if(checkemail){
            if(req.body.newpassword==req.body.confirmpassword){
                req.body.password=await bcrypt.hash(req.body.newpassword,10);
                let updatepass=await Admin.findByIdAndUpdate(checkemail._id,req.body);
                if(updatepass){
                    return res.status(200).json({msg:"password change successfully",data:updatepass});
                }
                else{
                    return res.status(400).json({msg:"password change successfully",errors:err});
                }
            }
            else{
                return res.status(200).json({msg:"newpassword and confirmpassword are not match"});
            }
        }
        else{
            return res.status(200).json({msg:"something is wrong"});
        }
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

module.exports.facultyregistration=async(req,res)=>{
    try{
        // console.log(req.body);
        let existemail=await Admin.findOne({email:req.body.email});
        if(!existemail){
            var gpass=generatePassword();
            var link="http://localhost:8000/api";

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "viradiyatanvi028@gmail.com",
                  pass: "synjakrzfpluksse",
                },
                tls:{
                    rejectUnauthorized:false
                }
              });

            const info = await transporter.sendMail({
                from: 'viradiyatanvi028@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "your login details", // Subject line
                html: `<h1>your login details</h1><p>email:${req.body.email}</p><p>password:${gpass}</p><p>for login click here:${link}</p>`, // html body
              });

            //   console.log("Message sent");

              if(info){
                let encrygpass=await bcrypt.hash(gpass,10);
                let addfaculty=await Faculty.create({email:req.body.email,password:encrygpass,username:req.body.username});
                if(addfaculty){
                    return res.status(200).json({msg:"check your mail for login",data:addfaculty});
                }
                else{
                    return res.status(200).json({msg:"faculty not registrater"});
                }
              }
              else{
                return res.status(200).json({msg:"email allready exist"});
              }
        }
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}