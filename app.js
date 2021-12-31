//Required all the npm packages
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

require('dotenv').config()

const app = express();
//used to access static local files through the server example styles.css 
app.use(express.static("public"));

const https = require("https");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})


app.post("/", function (req, res) {

    const firstname = req.body.firstName;
    const lastname = req.body.LastName;
    const email = req.body.email;
    console.log(firstname);
    console.log(lastname);
    console.log(email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    //data to be send to mailchimp
    var jsonData = JSON.stringify(data);
    const url = "https://us20.api.mailchimp.com/3.0/lists/"+process.env.AUDIENCE_ID;
    const options = {
        method: "POST",
        auth: "tanisha:"+process.env.API_KEY
    }

    const request=https.request(url, options, function (response) {
if(response.statusCode===200){
    res.sendFile(__dirname+"/success.html");
}
else{
    // res.send("There was an error");
    res.sendFile(__dirname+"/failure.html");
}
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});


app.post("/failure",function (req,res) {
    res.redirect("/");
})
//process.env.PORT helps heroku to assign port dynamically
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running")
})
