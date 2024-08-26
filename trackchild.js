const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const {lostChildModel} = require('./lostchild');
app.use(express.json());
app.use(cors({
    origin: '*', // Replace with your frontend domain -> http://192.168.1.102:5500
    credentials: true,
    methods:["GET","POST","PUT","DELETE"],
    headers:["Content-Type","Authorization"]
}));
//Listen on port 3000   
app.listen(3003, () => {
    console.log('Trackchild db is listening on port 3003');
});

const db_link = 'mongodb+srv://admin:Z31jPpQPTPxbBZcO@cluster0.sirybcy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(db_link)
    .then(() => {
        console.log("trackchild db connected");
    })
    .catch((err) => {
        console.error("Connection error:", err);
       // console.error("Topology description:", err.reason);
});

const trackchildSchema = new mongoose.Schema({
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
    firNo:{
        type:Number
    },
    firDate:{
        type:String
    }
})

const trackchildModel = mongoose.model('trackchildModel',trackchildSchema);

const trackchildroute = express.Router();
app.use('/trackchild', trackchildroute);

trackchildroute
.route('/trackchildInfo')
.post(trackchildInform);

async function trackchildInform(req, res){
    try{
        let dataObj = req.body;
        //console.log(dataObj);
        if (!dataObj.policeStation || !dataObj.district || !dataObj.state) {
            return res.status(400).json({
                message: "Missing required fields: policeStation, district, and state"
            });
        }
        const { state, district, policeStation, firNo, firDate } = dataObj;
        const matchingRecords = await lostChildModel.findOne({
            "complaintDetails.state": state,
            "complaintDetails.district": district,
            "complaintDetails.policeStation": policeStation,
            "complaintDetails.firNo": firNo,
            "complaintDetails.firDate": firDate
        });
        if (matchingRecords) {
            let data = await trackchildModel.create(dataObj);
            res.json({
                message: "credentials matched and stored successfully",
                data: data
            });
        } else {
            return res.json({
                message: "No matching records found in lostChildModel"
            });
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Error occurred while processing request"
        })
    }
}

module.exports = { trackchildModel, mongoose };