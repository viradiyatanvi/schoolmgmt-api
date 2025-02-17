const express=require('express');

const passport=require('passport');

const routes=express.Router();

const adminCtl=require('../../../../controller/api/v1/adminController');

routes.post('/adminregister',adminCtl.adminregister);

routes.post('/adminLogin',adminCtl.adminLogin);

routes.get('/adminprofile',passport.authenticate('jwt',{failureRedirect:'/api/adminfailertoken'}),adminCtl.adminprofile);

routes.get('/adminfailertoken',(req,res)=>{
    try{
        return res.status(401).json({msg:"invalid token"});
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong"});
    }
})

routes.put('/admineditprofile/:id',passport.authenticate('jwt',{failureRedirect:'/api/adminfailertoken'}),adminCtl.admineditprofile);

routes.post('/changepassword',passport.authenticate('jwt',{failureRedirect:'/api/adminfailertoken'}),adminCtl.changepassword);

routes.get('/adminlogout',passport.authenticate('jwt',{failureRedirect:'/api/adminfailertoken'}),adminCtl.adminlogout);

routes.post('/checkemail',passport.authenticate('jwt',{failureRedirect:'/api/adminfailertoken'}),adminCtl.checkemail);

routes.post('/updatepassword',passport.authenticate('jwt',{failureRedirect:'/api/adminfailertoken'}),adminCtl.updatepassword);

routes.post('/facultyregistration',adminCtl.facultyregistration);

routes.get('/facultyviewall',passport.authenticate('jwt',{failureRedirect:'/api/adminfailertoken'}),adminCtl.facultyviewall);

routes.get('/studentviewall',passport.authenticate('jwt',{failureRedirect:'/api/adminfailertoken'}),adminCtl.studentviewall);

routes.post('/multipledelete',passport.authenticate('jwt',{failureRedirect:'/api/adminfailertoken'}),adminCtl.multipledelete);

routes.get('/statuschange',passport.authenticate('jwt',{failureRedirect:'/api/adminfailertoken'}),adminCtl.statuschange);

module.exports=routes;