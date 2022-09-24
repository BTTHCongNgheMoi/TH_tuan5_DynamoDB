const express = require('express');
const multer = require('multer');
require('dotenv').config();

const data = require('./store');
const app = express();
const upload = multer();
const AWS = require('aws-sdk');
const { response } = require('express');

// 
app.use(express.static("./templates"));
app.set('view engine', 'ejs');
app.set('views', './templates');

// 

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
})

const docClient = new AWS.DynamoDB.DocumentClient();

const tblName = "tblSanPham";
// 


app.get('/', (req, res) => {
    const params = {
        TableName: tblName,
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            return res.send("Internal Server Error");
        } else {
            // console.log('data = ', JSON.stringify(data))
            return res.render('index', { sanPhams: data.Items });
        }
    });
})



app.get('/update', (req, res) => {
    // const { ma_sp } = req.body;
    console.log("🚀 ~ file: server.js ~ line 49 ~ app.get ~ req.body", req.body);

    return res.redirect("/");
    docClient.scan((err, data) => {
        console.log("🚀 ~ file: server.js ~ line 51 ~ docClient.scan ~ data", data)
        return res.render('form', { sanPham: data.ma_sp });
    })
})

app.post('/', upload.fields([]), (req, res) => {
    const { ma_sp, ten_sp, so_luong } = req.body;

    const params = {
        TableName: tblName,
        Item: {
            // "ma_sp": ma_sp,
            // "ten_sp": ten_sp,
            // "so_luong": so_luong
            ma_sp,
            ten_sp,
            so_luong
        }
    }

    docClient.put(params, (err, data) => {
        if (err) {
            return res.send("Internal Server Error");
        } else {
            return res.redirect("/");
        }
    })
});

app.post("/delete", upload.fields([]), (req, res) => {

    const { ma_sp } = req.body;
    const params = {
        TableName: tblName,
        Key: {
            ma_sp
        }
    }

    docClient.delete(params, (err, data) => {
        if (err) {
            console.log("🚀 ~ file: server.js ~ line 79 ~ docClient.put ~ err", err);
            return res.send("err ---- /delete");
        } else {
            return res.redirect("/");
        }
    });

});

app.listen(8981, () => {
    console.log(`Example app listening on port 8981`)
})