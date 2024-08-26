const express = require('express');
const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const cors = require('cors');
const multer = require('multer');
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*', // Replace with your frontend domain -> http://192.168.1.102:5500
    credentials: true,
    methods:["GET","POST","PUT","DELETE"],
    headers:["Content-Type","Authorization"]
}));
// Listen on port 3000
app.listen(3002, () => {
    console.log('lostchild db is listening on port 3002');
});

const db_link = 'mongodb+srv://admin:Z31jPpQPTPxbBZcO@cluster0.sirybcy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(db_link)
    .then(() => {
        console.log("lostchild db connected");
    })
    .catch((err) => {
        console.error("Connection error:", err);
       // console.error("Topology description:", err.reason);
});

const ImageSchema = new mongoose.Schema({
    filename: String,
    url: String,
    uploadDate: { type: Date, default: Date.now },
    imageType: { type: String, required: true }
});

const IncidentDetailSchema = new mongoose.Schema({
    dateOfDisappearance:{
        type:String,
        required: true
    },
    timeOfDisappearance:{
        type:String,
        required: true
    },
    locationOfDisappearance:{
        type:String,
        required: true
    },
    circumstancesOfDisappearance:{
        type:String,
        required: true
    },
    lastKnownActivities: String,
    possibleDestinations: String,
    clothingLastSeenWearing: String

});
const contactDetailSchema= new mongoose.Schema({
    reportingPersonName:{
        type:String,
        required:true
    },
    relationToChild:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phoneNumber: {
        type:String,
        maxLength:10
    },
    telephoneNumber: {
        type:String,
        maxLength:10    
    },
    email:{
        type:String,
        required:true,
        validate:function(){
            return emailValidator.validate(this.email);
        }
    }
});
const complaintDetailsSchema = new mongoose.Schema({
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
    hasLodgedComplaint: Boolean,
    firNo:{
        type:String
    },
    firDate:{
        type:Date
    }
});

const lostChildSchema =  mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    dob:{
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
    accessories:{
        type:String,
        required:true
    },
    image:ImageSchema,
    incidentDetails:IncidentDetailSchema,
    contactDetails: contactDetailSchema,
    complaintDetails:complaintDetailsSchema
})

const lostChildModel = mongoose.model('lostChildModel', lostChildSchema);

const userMissing = express.Router();
app.use('/missingchild', userMissing);


userMissing
.route('/sendInfo')
.post(missingChildInfo);

async function missingChildInfo(req, res){
    try{
        const dataObj = req.body;

        let data = await lostChildModel.create(dataObj);
        return res.json({
            message:"Info sent successfully",
            data:data
        })
    }catch(err){
        console.log(err);
    }
}

module.exports = { lostChildModel, mongoose };