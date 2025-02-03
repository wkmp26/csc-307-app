// backend.js
import express from "express";
import cors from "cors";
import service from "./services/user-service.js"


/*
{
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
} from

*/

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

/*
const findUserByName = (name) => {
    users = getUsers.then((res)=>res.toObject()).catch(console.log("An Error has Occured"))
    return users["users_list"].filter(
      (user) => user["name"] === name
    );
  };

const findUserByNameJob = (name, job) => {
    return users["users_list"].filter(
      (user) => ((user["name"] === name) && (user["job"] === job))
    );
  };

const findUserByJob = (job) => {
    return users["users_list"].filter(
      (user) => user["job"] === job
    );
  };

const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
    users["users_list"].push(user);
    return user;
  };

const removeUser = (id) => {
    users["users_list"] = users["users_list"].filter((user) => user["id"] != id);
}
    */
    
  
app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if ((name != undefined) && (job != undefined)){
      //let result = findUserByNameJob(name,job);
      service.findUserByNameJob(name,job).then(
          (users)=>{
            let users_list = { users_list: users.map(user => user.toObject())};
            res.send(users_list);
      }).catch(console.log((error) => console.error(error)));
    } else if (name != undefined){
        /*let result = findUserByName(name);
        let result = findUserByName(name).then((res)=>res.map(user => user.toObject())).catch("An Error has Occured")
        result = { users_list: result };
        res.send(result);
        */
        service.getUsers(name,undefined)
        .then(
          (users)=>{
            let users_list = { users_list: users.map(user => user.toObject())};
            res.send(users_list);
      }).catch(console.log((error) => console.error(error)))
    }else if (job != undefined) {
        /*let result = findUserByJob(job);
        let result = findUserByJob(job).then((res)=>res.map(user => user.toObject())).catch("An Error has Occured")
        result = { users_list: result };
        res.send(result); */
        service.getUsers(undefined,job)
        .then(
          (users)=>{
            let users_list = { users_list: users.map(user => user.toObject())};
            res.send(users_list);
      }).catch(console.log((error) => console.error(error)))
        
    } else {

      service.getUsers(undefined,undefined)
        .then(
          (users)=>{
            let users_list = { users_list: users.map(user => user.toObject())};
            res.send(users_list);
      }).catch(console.log((error) => console.error(error)))
      console.log("Complete!");
      
      // res.send(users);
    }
  });
  
  //GET user by ID
  app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    //let result = findUserById(id);
    let result = undefined;
    service.findUserById(id)
              .then((user)=>{
                result = user.toObject(); 
                if (result === undefined) {
                  res.status(404).send("Resource not found.");
                } else {
                  res.send(result);
                }
              }).catch("An Error has Occured")
    
  
  });

  //POST
  app.post("/users", (req, res) => {
    const userToAdd = req.body;
    //userToAdd["id"] = Math.random();
    //addUser(userToAdd);
    service.addUser(userToAdd).then(()=>res.status(201).send(JSON.stringify(userToAdd)));

    //res.status(201).send(JSON.stringify(userToAdd));
  });

  app.delete("/users/:id", (req, res) => {
    console.log("Delete Request");
    const id = req.params["id"]; //or req.params.id

    if( id == undefined){
        res.status(404).send("Resource not found.");
    }else{
      service.deleteUserById(id).then(()=>res.status(204).send()).catch(console.log((error) => console.error(error)));
      }
    });

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

/*
const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
  };
  */