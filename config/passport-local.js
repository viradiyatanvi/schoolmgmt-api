const passport=require('passport');

const JwtStrategy =require('passport-jwt').Strategy;

const ExtractJwt =require('passport-jwt').ExtractJwt;

let opts={
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey :"RNW",
};

const Admin=require('../models/AdminModels');

passport.use(new JwtStrategy(opts,async(payload,done)=>{
    let checkemail=await Admin.findOne({email:payload.admindata.email});
    if(checkemail){
        return done(null,checkemail);
    }
    else{
        return done(null,false);
    }
}));

passport.serializeUser((user,done)=>{
    return done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    let admindata=await Admin.findById(id);
    if(admindata){
        return done(null,admindata);
    }
    else{
        return done(null,false);
    }
})

module.exports=passport;