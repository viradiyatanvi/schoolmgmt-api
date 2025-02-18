const Student = require("../../../models/StudentModels");

const bcrypt=require('bcrypt');

const jwt=require('jsonwebtoken');

const passport=require('passport');

const nodemailer = require('nodemailer');


module.exports.studentlogin=async(req,res)=>{
    try{
        let checkemail=await Student.findOne({email:req.body.email});
        if(checkemail){
            let checkpassword=await bcrypt.compare(req.body.password,checkemail.password)
            if(checkpassword){
                let studenttoken=await jwt.sign({studentdata:checkemail},"SRNW",{expiresIn:1000*60*60})
                if(studenttoken){
                    return res.status(400).json({msg:"student login successfully",studenttoken:studenttoken})
                }
                else{
                    return res.status(400).json({msg:"student not login"}); 
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

module.exports.studentprofile=async(req,res)=>{
    try{
        return res.status(200).json({msg:'student information',data:req.user})
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

module.exports.studenteditprofile=async(req,res)=>{
    try{
        let checkstudentid=await Student.findById(req.params.id)
        if(checkstudentid){
            editstudentdata=await Student.findByIdAndUpdate(req.params.id,req.body)
            if(editstudentdata){
                let editprofile=await Student.findById(req.params.id)
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

module.exports.studentchangepassword=async(req,res)=>{
    try{
        let checkcurrentpassword=await bcrypt.compare(req.body.currentpassword,req.user.password)
        if(checkcurrentpassword){
            if(req.body.currentpassword!=req.body.newpassword){
                if(req.body.newpassword==req.body.confirmpassword){
                    req.body.password=await bcrypt.hash(req.body.newpassword,10);
                    let updatepassword=await Student.findByIdAndUpdate(req.user._id,req.body)
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

module.exports.studentcheckemail=async(req,res)=>{
    try{
        let checkemail=await Student.findOne({email:req.body.email})
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
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong",errors:err});
    }
}

module.exports.studentcheckpassword=async(req,res)=>{
    try{
        let checkemail=await Student.findOne({email:req.query.email})
        if(checkemail){
            if(req.body.newpassword==req.body.confirmpassword){
                req.body.password=await bcrypt.hash(req.body.newpassword,10)
                let updatepass=await Student.findByIdAndUpdate(checkemail._id,req.body)
                if(updatepass){
                    return res.status(200).json({msg:"password change successfully",data:updatepass});
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

module.exports.studentlogout=async(req,res)=>{
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

module.exports.multipledelete = async (req, res) => {
    try {
        let deletedata=await Student.deleteMany({_id:{$in:req.body.ids}});
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
//         let checkuser=await Student.findById(req.query.userid);
//         if(checkuser){
//             if(req.query.userstatus == "true"){
//                 let checkstatus=await User.findByIdAndUpdate(req.query.userid,{status:false});
//                 if(checkstatus){
//                     return res.status(200).json({'msg':"status dactive update",data:checkstatus});
//                 }
//                 else{
//                     return res.status(400).json({'msg':"data not update",error:err});
//                 }
//             }   
//             else{
//                 if(req.query.userstatus){
//                     let checkstatus=await Student.findByIdAndUpdate(req.query.userid,{status:true});
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