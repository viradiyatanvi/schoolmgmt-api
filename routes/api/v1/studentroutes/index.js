const express=require('express');

const passport=require('passport');

const routes=express.Router();

const studentCtl=require('../../../../controller/api/v1/studentController');

routes.post('/studentlogin',studentCtl.studentlogin);

routes.get('/studentprofile',passport.authenticate('student',{failureRedirect:'/api/student/studentfailertoken'}),studentCtl.studentprofile);

routes.get('/studentfailertoken',async(req,res)=>{
    try{
        return res.status(401).json({msg:"invalid token"});
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong"});
    }
});

routes.put('/studenteditprofile/:id',passport.authenticate('student',{failureRedirect:'/api/student/studentfailertoken'}),studentCtl.studenteditprofile);

routes.post('/studentchangepassword',passport.authenticate('student',{failureRedirect:'/api/student/studentfailertoken'}),studentCtl.studentchangepassword);

routes.post('/studentcheckemail',passport.authenticate('student',{failureRedirect:'/api/student/studentfailertoken'}),studentCtl.studentcheckemail);

routes.post('/studentcheckpassword',passport.authenticate('student',{failureRedirect:'/api/student/studentfailertoken'}),studentCtl.studentcheckpassword);

routes.get('/studentlogout',passport.authenticate('student',{failureRedirect:'/api/student/studentfailertoken'}),studentCtl.studentlogout);

routes.post('/multipledelete',passport.authenticate('student',{failureRedirect:'/api/student/studentfailertoken'}),studentCtl.multipledelete);

// routes.get('/statuschange',passport.authenticate('student',{failureRedirect:'/api/student/studentfailertoken'}),studentCtl.statuschange);

module.exports=routes;