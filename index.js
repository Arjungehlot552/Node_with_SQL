const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express= require('express');
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Arjun@123'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(), // Generate UUID with fixed length
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
  ];
};


// Home route
app.get("/" , (req ,res)=>{
  let q = `select count(*) from user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs" , {count});
    });
  } catch (err) {
    console.log(err);
    res.send("some error in Database");
  }
})

// Show Route
app.get("/user" , (req ,res)=>{
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showuser.ejs" , {users})
      // console.log(result);
      // res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.send("some error in Database");
  }
})

// EDIT Routes

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs" , {user});
    });
  } catch (err) {
    console.log(err);
    res.send("some error in Database");
  }
});

// Add new User

app.post("/user/:id/addnewuser", (req, res) => {
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.render("addnewsuer.ejs");
    });
  } catch (err) {
    console.log(err);
    res.send("some error in Database");
  }
});

//Update route

app.patch("/user/:id" , (req,res)=>{
  let { id } = req.params;
  let {password: formPass , username : newUsername } = req.body; 
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password){
        res.send("Incorrect Password !");
      }else{
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2 , (err , result)=>{
          if (err) throw err;
          res.redirect("/user");
        })
      }
    });
  } catch (err) {
    console.log(err);
    res.send("some error in Database");
  }  
})


app.listen(8080, () => {
  console.log('Server is running on port 8080');
});


// let q = "INSERT INTO user (id, username, email, password) VALUES ?";

// let data1 = [];

// for (let i = 0; i < 10; i++) {
//   data1.push(getRandomUser());
// }

