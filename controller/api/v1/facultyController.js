const Faculty=require('../../../models/FacultyModel');

const bcrypt=require('bcrypt');

const jwt=require('jsonwebtoken');

const nodemailer = require('nodemailer');

const passport=require('passport');

module.exports.facultylogin=async(req,res)=>{
    try{
        // console.log(req.body);
        let checkfacultyEmail=await Faculty.findOne({email:req.body.email});
       if(checkfacultyEmail){
        let checkpassword=await bcrypt.compare(req.body.password,checkfacultyEmail.password);
        if(checkpassword){
            checkfacultyEmail=checkfacultyEmail.toObject();
                delete checkfacultyEmail.password; 
                console.log("delete",checkfacultyEmail);
            let facultytoken=await jwt.sign({ft:checkfacultyEmail},"FRNW",{expiresIn:"1h"});
            if(facultytoken){
                return res.status(400).json({msg:"faculty login successfully",facultytoken:facultytoken});
            }
            else{
                return res.status(400).json({msg:"faculty not login"}); 
            }
        }
        else{
            return res.status(400).json({msg:"invalid password"});
        }
       }
       else{
        return res.status(400).json({msg:"invalid email"});
       }
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

module.exports.facultyprofile=async(req,res)=>{
    try{
        return res.status(200).json({msg:"faculty information",data:req.user});
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

module.exports.facultyeditprofile=async(req,res)=>{
    try{
        // console.log(req.params.id);
        // console.log(req.body);
        let checkfacultyid=await Faculty.findById(req.params.id);
        if(checkfacultyid){
            let editfacultydata=await Faculty.findByIdAndUpdate(req.params.id,req.body);
            if(editfacultydata){
                let editprofile=await Faculty.findById(req.params.id);
                return res.status(200).json({msg:"data update profile",data:editprofile});
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

module.exports.facultychangepassword=async(req,res)=>{
    try{
        let checkcurrentpassword=await bcrypt.compare(req.body.currentpassword,req.user.password);
        if(checkcurrentpassword){
            if(req.body.currentpassword!=req.body.newpassword){
                if(req.body.newpassword==req.body.confirmpassword){
                    req.body.password=await bcrypt.hash(req.body.newpassword,10)
                    let updatepassword=await Faculty.findByIdAndUpdate(req.user._id,req.body);
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

module.exports.checkfacultyemail=async(req,res)=>{
    try{
        let ckeckfacultyemail=await Faculty.findOne({email:req.body.email});
        if(ckeckfacultyemail){
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
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err}); 
    }
}

module.exports.checkfacultypassword=async(req,res)=>{
    try{
        let checkemails=await Faculty.findOne({email:req.query.email});
        if(checkemails){
            if(req.body.newpassword==req.body.confirmpassword){
                req.body.password=await bcrypt.hash(req.body.newpassword,10);
                let updatedatapass=await findByIdAndUpdate(checkemails._id,req.body)
                if(updatedatapass){
                    return res.status(200).json({msg:"password change successfully",data:updatedatapass});
                }
                else{
                    return res.status(200).json({msg:"password not change"});
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

module.exports.facultylogout=async(req,res)=>{
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