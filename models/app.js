const express = require('express');
const mongoose = require('mongoose');
const {Pool} = require('pg'); //Pool class to create a new instance of a PostgreSQL client. that you can use to connect to your database.
const emailValidator = require('email-validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const JWT_KEY = 'heuiwyr8934y2quxi';
//const userRouter = require('../routers/userRouter');

const app = express();
//middleware to parse json


const allowedOrigins = ['http://192.168.216.71:5501', 'http://192.168.1.103:5501','http://192.168.1.104:5501','http://192.168.1.105:5501','*','http://192.168.1.100:5501',"http://192.168.1.107:5501", "http://192.168.1.99:5501", "http://192.168.1.109:5501","*"]; // for cookies always specify the domain 
const corsOptions = {
    origin: function(origin, callback) {
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

//app.use("/user", userRouter);

// Listen on port 3000
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

const db_link = 'mongodb+srv://admin:Z31jPpQPTPxbBZcO@cluster0.sirybcy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(db_link)
    .then(() => {
        console.log("db connected");
    })
    .catch((err) => {
        console.error("Connection error:", err);
       // console.error("Topology description:", err.reason);
    });

const postdb = new Pool({
    host: 'localhost',
    user:'postgres',
    port:5432,
    password:"12052005",
    database: 'khoya-paya'  
});

postdb.connect()
  .then(obj => { 
    console.log('Connected to PostgreSQL');
  })
  .catch(error => {
    console.error('PostgreSQL connection error:', error.message);
});

// postdb.query('Select * from best_match',(err, res)=>{
//     if(!err){
//         console.log(res.rows);  
//     }else{
//         console.log(err);
//     }
//     postdb.end;
// })

app.get('/api/best_match', async (req, res) => {
    try {
        const result = await postdb.query('SELECT * FROM best_match ORDER BY matchingpercentage DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/lostchild', async (req, res) => {
    try {
        const result = await postdb.query('SELECT * FROM lostchild');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:function(){
            return emailValidator.validate(this.email);
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    confirmPassword:{
        type:String,
        minLength:8,
        validate:function(){
            return this.confirmPassword === this.password
        }
    },
     firstLogin: {
        type: Boolean,
        default: true
    },
    resetToken: {type:String, default:null},
    resetTokenExpiry: { // Field to store token expiration time
        type: Date,
        default: null
    }
})

userSchema.pre('save',function(){
    this.confirmPassword = undefined;
})

// userSchema.pre('save',async function(next){
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// })

userSchema.methods.createResetToken=function(){
    // To generate a new hexadecimal token everytime, we use crypto
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetToken = resetToken;
    this.resetTokenExpiry = Date.now() + 5 * 60 * 1000; // Set expiry time to 10 minutes from now
    console.log(this.resetToken);
    return resetToken;
}

userSchema.methods.resetPasswordHandler = function(password, confirmPassword){
    this.password= password;
    this.confirmPassword= confirmPassword;
    this.resetToken =undefined;
    this.resetTokenExpiry = undefined;
    //console.log('After:', this.resetToken, this.resetTokenExpiry);
}

const userModel = mongoose.model('userModel', userSchema);

app.get('/login', function(req, res) {
    res.redirect("/login.html")
})

app.get('/main', function(req, res) {
    res.redirect("/main.html")
})
module.exports = [userModel, app];