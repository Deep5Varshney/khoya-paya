const express = require('express');
const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*', // Replace with your frontend domain -> http://192.168.1.102:5500
    credentials: true,
    methods:["GET","POST","PUT","DELETE"],
    headers:["Content-Type","Authorization"]
}));
// Listen on port 3000
app.listen(3001, () => {
    console.log('foundchild db is listening on port 3001');
});

const db_link = 'mongodb+srv://admin:Z31jPpQPTPxbBZcO@cluster0.sirybcy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(db_link)
    .then(() => {
        console.log("foundchild db connected");
    })
    .catch((err) => {
        console.error("Connection error:", err);
       // console.error("Topology description:", err.reason);
});

const childDetailsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    fatherName:{
        type:String,
        required:true
    },
    motherName:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    height:{
        type:String,
        required:true
    },
    weight:{
        type:String,
        required:true
    },
    eyeColor:{
        type:String,
        required:true
    },
    hairColor:{
        type:String,
        required:true
    },
    complexion:{
        type:String,
        required:true
    },
    distinguishingMarks:{
        type:String,
        required:true
    },
    clothesLastSeen:{
        type:String,
        required:true
    },
    accessories:{
        type:String,
        required:true
    }

});

const locationDetailsSchema= new mongoose.Schema({
    date:{
        type:String,
        required:true,
    },
    time:{
        type:String,
        required:true
    },
    locationFound:{
        type:String,
        required:true
    },
    surroundingEnv:{
        type:String,
        required:true
    }
})

const authoritiesNotifiedSchema = new mongoose.Schema({
    state:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    policeStation:{
        type:String,
        required:true
    },
    caseReferenceNumber:Number
})
const contactDetailsSchema = new mongoose.Schema({
    reportingPerson:{
        type:String,
        required:true
    },
    phoneNumber:Number,
    telephoneNumber:Number,
    email:{
        type:String,
        required:true
    }
});

const foundChildSchema = mongoose.Schema({

    childDetails: childDetailsSchema,
    locationDetails: locationDetailsSchema,
    authoritiesNotified: authoritiesNotifiedSchema,
    contactDetails: contactDetailsSchema,
    additionalNotes:String
    
})

const foundChildModel= mongoose.model('foundChildModel', foundChildSchema);

const userFound = express.Router();
app.use('/foundChild', userFound);

userFound
.route('/retrieveInfo')
.post(foundChildInfo);


async function foundChildInfo(req, res){
    try{
        let dataObj = req.body;
        let data = await foundChildModel.create(dataObj);
        return res.json({
            message:"Info sent successfully",
            data:data
        })
    }catch(err){
        console.log(err);
    }
}

module.exports = { foundChildModel, mongoose };