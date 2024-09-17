import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "pass",
  port: 5433,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let currentUserId;
let user_id_list = await Users();



async function checkVisisted() {
  const result = await db.query("SELECT * FROM visited_countries JOIN users ON users.id = user_id;");
  let countries = [];
  result.rows.forEach((country) => {
    if (country.user_id === currentUserId)
    countries.push(country.country_code);
  });
  return countries;
}


async function Users() {
  const result = await db.query("SELECT * FROM users;");
  let users = [];
  result.rows.forEach((user) => {
    users.push({id : user.id , name : user.name , color : user.color});
  });
  return users;
}
currentUserId = user_id_list[0].id;

app.get("/", async (req, res) => {
  let users = await Users();
  if (users.length == 0){
    res.render("new.ejs");}
  else {
  let countries = await checkVisisted();
  console.log(countries);
  let user = users.find((user) => user.id === currentUserId); 
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: user.color,
  });
};
});


app.post("/add", async (req, res) => {
  const input = req.body["country"];
  let users = await Users();
  let user = users.find((user) => user.id === currentUserId); 
  const countries = await checkVisisted();
  try {
    if (!input){
      throw "Cant be empty";
    }
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code , user_id) VALUES ($1 , $2)",
        [countryCode , currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        users: users,
        color: user.color,
        error: "Country has already been added, try again.",
      });
    }
  } catch (err) {
    console.log(err);
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: user.color,
      error: "Country name does not exist, try again.",
    });
  }
});

app.post("/user", async (req, res) => {
  let user_id = parseInt(req.body.user);
  console.log(req.body.clear)
  if (req.body.remove === 'remove'){
    console.log(user_id)
    try{
    await db.query(
      "DELETE FROM visited_countries WHERE user_id = $1;",
      [currentUserId]
    );  }
    catch (err) {
      console.log(err);
      
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        users: users,
        color: user.color,
        error: "ERROR REMOVING.",
      });
    };
    try{
    await db.query(
      "DELETE FROM users WHERE id = $1;",
      [currentUserId]
    ); }
    catch (err) {
      console.log(err);
      
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        users: users,
        color: user.color,
        error: "ERROR REMOVING.",
      });
    };
    
    currentUserId = user_id_list[0].id;
    res.redirect("/");
  }

  else if (req.body.clear === 'clear'){
    await db.query(
      "DELETE FROM visited_countries WHERE user_id = $1;",
      [currentUserId]
    );  
    res.redirect("/");
  }else if (!req.body.add){
    currentUserId = user_id;
    res.redirect("/");
  }
  else{
    res.render("new.ejs");
  };
});

app.post("/new", async (req, res) => {
  let color = req.body.color ;
  let name = req.body.name ;
  try{
    if (!name ){
      throw "Name Cant be empty";
    }
    if (!color ){
      throw "Color Cant be empty";
    }
  let result = await db.query(
    "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id;",
    [name, color]
  );  
    currentUserId = result.rows[0].id;
    res.redirect("/")
  }
  catch (err) {
  console.log(err);
  res.render("new.ejs" , {error : err})
  };
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
