const express=require('express');

const port=8000;

const app=express();

const db=require('./config/db');

// const mongoose=require('mongoose');
// mongoose.connect("mongodb+srv://tanviViradiya28:Tanvi123@cluster0.sk3ly.mongodb.net/schoolmanagement", {
//     // useNewUrlParser: true, 
//     // useUnifiedTopology: true 
// })
// .then(() => console.log("DB is connected"))
// .catch((err) => console.log(err));

const passport=require('passport');

const JwtStrategy=require('./config/passport-local');

const session=require('express-session');

app.use(express.urlencoded());

app.use(session({
    name:"panel",
    secret:"RNW",
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:1000*60*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/api',require('./routes/api/v1/adminroutes'));
app.use('/api/faculty',require('./routes/api/v1/facultyRoutes'));
app.use('/api/student',require('./routes/api/v1/studentroutes'));

app.listen(port,(err)=>{
    if(err){
        console.log("server is not start");
        return false;
    }
    console.log("server is start http://localhost:"+port)
})