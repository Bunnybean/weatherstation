const express = require("express");
const https = require('https');
const bodyParser = require('body-parser');
var _= require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//weather info
let query="";
let apiKey = "";
let unit = "";
let url = "";

app.get("/", function(req, resp){

    /*
    //date info
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-US", options);
    */
    let na="";
    //render
    resp.render("main", {nothing: na});


});

app.post("/", function(req, resp){

    query = _.capitalize(req.body.cityName);
    apiKey = "bca1ec1715e10766178fff501df3e177";
    unit = "metric";
    url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    resp.redirect("/result");

});

app.get("/result", function(req, resp){

    //date info
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-US", options);

    https.get(url, function(response){

        console.log(response.statusCode);
        response.on("data", function(data){
            //JSON -> JS
            const weatherData = JSON.parse(data);
            let temp = weatherData.main.temp;
            let desc = weatherData.weather[0].description;
            let humid = weatherData.main.humidity;
            let wind = weatherData.wind.speed;

                resp.render("result", {kindOfDay: day, place:query, temperature:temp, description:desc, humidity:humid, windSpeed: wind});
            //let icon = weatherData.weather[0].icon;
            //let imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            //resp.render("result", {kindOfDay: day, place:query, temperature:temp, description: desc, img:imgURL});

            //test
            console.log(weatherData);
            console.log(temp);
            console.log(desc);
         });
    });
});

app.post("/result", function(req, resp){
    resp.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function(){
    console.log("Server is running on port 3000");
});

