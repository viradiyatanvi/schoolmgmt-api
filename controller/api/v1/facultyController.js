const Faculty=require('../../../models/FacultyModel');

const Student=require('../../../models/StudentModels');

const bcrypt=require('bcrypt');

const jwt=require('jsonwebtoken');

const nodemailer = require('nodemailer');
const passport = require('passport');

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
                let updatedatapass=await Faculty.findByIdAndUpdate(checkemails._id,req.body)
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

module.exports.studentregistration=async(req,res)=>{
    try{
        let existemail=await Student.findOne({email:req.body.email});
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
                          if(info){
                            let encrygpass=await bcrypt.hash(gpass,10);
                            let addfaculty=await Student.create({email:req.body.email,password:encrygpass,username:req.body.username});
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

module.exports.studentviewall=async(req,res)=>{
    try{

        let search='';
        if(req.query.search){
            search=req.query.search
        }

        let page=0;
        let per_page=2
        if(req.query.page){
            page=req.query.page
        }

        let viewdata=await Student.find({status:true,
            $or:[
                {username:{$regex:search}},
                {email:{$regex:search}}
            ]
        }).sort({username:-1}).skip(page*per_page).limit(per_page);

        let totaldata=await Student.find({status:true,
            $or:[
                {username:{$regex:search}},
                {email:{$regex:search}}
            ]
        }).countDocuments();

        let totalpage=Math.ceil(totaldata/per_page);

        let admindatasfalse=await Student.find({status:false});

        if(viewdata){
            return res.status(200).json({msg:"faculty user show successfully",
                data:viewdata,
                page:page,
                admindatasfalse:admindatasfalse,
                totalpage:totalpage,
                search:search
            });
        }
        else{
            return res.status(200).json({msg:"not faculty user show"});
        }
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

module.exports.multipledelete = async (req, res) => {
    try {
        let deletedata=await Faculty.deleteMany({_id:{$in:req.body.ids}});
        if(deletedata){
            return res.status(200).json({'msg':"data deleted successfully",data:deletedata});
        }
        else{
            return res.status(400).json({'msg':"data not delete",error:err});
        }
    } catch (err) {
        return res.status(400).json({ msg: "Something went wrong", error: err.message });
    }
};

// module.exports.statuschange=async(req,res)=>{
//     try{
//         let checkuser=await User.findById(req.query.userid);
//         if(checkuser){
//             if(req.query.userstatus == "true"){
//                 let checkstatus=await Faculty.findByIdAndUpdate(req.query.userid,{status:false});
//                 if(checkstatus){
//                     return res.status(200).json({'msg':"status dactive update",data:checkstatus});
//                 }
//                 else{
//                     return res.status(400).json({'msg':"data not update",error:err});
//                 }
//             }   
//             else{
//                 if(req.query.userstatus){
//                     let checkstatus=await Faculty.findByIdAndUpdate(req.query.userid,{status:true});
//                     if(checkstatus){
//                         return res.status(200).json({'msg':"status active update",data:checkstatus});
//                     }
//                     else{
//                         return res.status(400).json({'msg':"data not update",error:err});
//                     }
//                 }
//             }
//         }
//     }
//     catch(err){
//         return res.status(400).json({'msg':"something is wrong",error:err});
//     }
// }

module.exports.statuschange=async(req,res)=>{
    try{
        let checkuser=await Student.findById(req.query.userid);
        if(checkuser){
            if(req.query.status == "true"){
                let checkstatus=await Student.findByIdAndUpdate(req.query.userid,{status:false});
                if(checkstatus){
                    return res.status(200).json({'msg':"status dactive update",data:checkstatus});
                }
                else{
                    return res.status(400).json({'msg':"data not update",error:err});
                }
            }   
            else{
                if(req.query.status){
                    let checkstatus=await Student.findByIdAndUpdate(req.query.userid,{status:true});
                    if(checkstatus){
                        return res.status(200).json({'msg':"status active update",data:checkstatus});
                    }
                    else{
                        return res.status(400).json({'msg':"data not update",error:err});
                    }
                }
            }
        }
    }
    catch(err){
        return res.status(400).json({'msg':"something is wrong",error:err});
    }
}