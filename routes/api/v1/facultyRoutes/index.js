const express=require('express');

const passport=require('passport');

const routes=express.Router();

const facultyCtl=require('../../../../controller/api/v1/facultyController');

routes.post('/facultylogin',facultyCtl.facultylogin);

routes.get('/facultyprofile',passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailertoken'}),facultyCtl.facultyprofile);

routes.get('/facultyfailertoken',(req,res)=>{
    try{
        return res.status(401).json({msg:"invalid token"});
    }
    catch(err){
        return res.status(400).json({msg:"something is wrong"});
    }
});

routes.put('/facultyeditprofile/:id',passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailertoken'}),facultyCtl.facultyeditprofile);

routes.post('/facultychangepassword',passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailertoken'}),facultyCtl.facultychangepassword);

routes.post('/checkfacultyemail',passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailertoken'}),facultyCtl.checkfacultyemail);

routes.post('/checkfacultypassword',facultyCtl.checkfacultypassword);

routes.get('/facultylogout',passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailertoken'}),facultyCtl.facultylogout);

routes.post('/studentregistration',passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailertoken'}),facultyCtl.studentregistration);

routes.get('/studentviewall',passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailertoken'}),facultyCtl.studentviewall);

routes.post('/multipledelete',passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailertoken'}),facultyCtl.multipledelete);

// routes.get('/statuschange',passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailertoken'}),facultyCtl.statuschange);

routes.get('/statuschange',passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyfailertoken'}),facultyCtl.statuschange);

module.exports=routes