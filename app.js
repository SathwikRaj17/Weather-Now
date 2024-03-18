import express from "express"
import { dirname } from "path"
import { fileURLToPath } from "url"
import bodyparser from "body-parser"
import env from "dotenv"
env.config();
const app=express();
const port=process.env.PORT || 3000;
const pth=dirname(fileURLToPath(import.meta.url));
const d=new Date();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set('view engine','ejs')


async function fetchd(location)
{
  
    const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.apiid}`);
    const data=await res.json();
    return data;
}

app.listen(port,function(req,res)
{
    console.log(`listening on ${port}`)
})


app.get("/",function(req,res)
{
    res.sendFile(pth+"/public/index.html")

})

function pt(condition)
{
    const time=d.getHours();
    console.log(condition)
    if(condition == "Rain" && time<18)
    {
        const path="rainy-day.mp4"
        return path;
    }
    else if(condition =="Clear" && time<18)
    {
        const path="clear-day.mp4"
        return path
    }
    else if(condition =="Clear" && time>=18)
    {
        const path="clear-night.mp4"
        return path
    }
    else if(condition == "Rain" && time>=18)
    {
        const path="rainy-night.mp4"
        return path
    }
    else if(time>=18)
    {
        const path="night.mp4"
        return path
    }
    else if(time<18)
    {
        const path="day.mp4"
        return path
    }
}

app.post("/search", async function (req, res) {
    try {
        const location = req.body.location;
        const resp = await fetchd(location);

        if (!resp.weather || resp.weather.length === 0) {
            throw new Error("Weather data not found");
        }

        const condition = resp.weather[0].main;
        console.log(resp.weather[0]);

        const data = {
            temp: resp.main.temp,
            min: resp.main.temp_min,
            max: resp.main.temp_max,
            speed: resp.wind.speed,
            deg: resp.wind.deg,
            path: pt(condition)
        };

        res.render("result.ejs", data);
    } catch (error) {
        console.error(error);
        res.sendFile(pth + "/public/index.html");
    }
});
)