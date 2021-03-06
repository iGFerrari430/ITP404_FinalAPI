const express = require('express');
const app = express();
const axios = require('axios')
var cityList = require("./city.list.json");
var cors = require('cors')

const corsOptions = {
  origin: 'http://hallowed-light.surge.sh'
}

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.json());
const {ENVIRONMENT,PORT} = process.env;
const db = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      body: 'something here...'
    },
    {
      id: 2,
      title: 'Post 2',
      body: 'something else here...'
    }
  ],
  users: [
    {
      id: 1,
      username: "dummy", 
      password: "123456",
      history: []
    }
  ]
};

app.get("/searchCity/:cityName",cors(),(request,response) => {
  const name = request.params.cityName;
  const cities = cityList.filter((city) => {
    return city.name === name
  })

  response.json(cities);
})
app.get("/searchId/:cityId",cors(),async(request,response) => {
  const cityId = request.params.cityId;
  const searchURL = `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&APPID=65b4d360dbe666bf7718ee48e12731f8`;
  try {
    const call = await axios.get(searchURL);

    console.log(call);
    response.json(call.data);
  }catch(err){
    response.status(404).send("id does not exist")
  }
})
app.post("/authUser",cors(),(request,response) => {
  let user = db.users.find((user) => {
    return request.body.username === user.username;
  });
  if (user){
    if (user.password === request.body.password){
      response.send();
    }else{
      response.status(404).send({
        error: "Incorrect password"
      })
    }
  }else{
    let len = db.users.length;
    db.users.push({
      id: len+1,
      username: request.body.username,
      password: request.body.password,
      history: []
    })
    response.send();
  }
})
app.put("/changePassword",cors(),(request,response) => {
  let user = db.users.find((user) => {
    return request.body.username === user.username;
  });

  user.password = request.body.password;
  response.send();
})
app.delete("/deleteHistory/:username",cors(),(request,response) => {
  let user = db.users.find((user) => {
    return request.params.username === user.username;
  });

  user.history = [];
  response.send();
})
app.post("/addHistory",cors(),(request,response) => {
  let user = db.users.find((user) => {
    return request.body.username === user.username;
  })
  const va = {
    content: request.body.history
  }
  user.history.push(va);
  response.send();
})
app.get("/getHistory/:userName",cors(),(request,response) => {
  let user = db.users.find((user) => {
    return request.params.userName === user.username;
  });

  response.json(user.history);
})
app.get("/userProfile/:username",cors(),(request,response) => {
  let user = db.users.find((user) => {
    return request.params.username === user.username;
  });

  response.json(user);
})
app.get("/api/everything",cors(),(request,response) => {
  response.json(db);
});

app.listen(PORT || 8000);