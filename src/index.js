const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const { existsSync } = require("fs");

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login");
});

//signup
app.post("/signup", async (req, res) => {
  try {
    const data = {
      name: req.body.username1,
      password: req.body.password1,
    };
    const checkExistsUser = await collection.findOne({ name: data.name });
    if (checkExistsUser) {
      return res
        .status(400)
        .send("User already exists. Please choose a different username.");
    } else {
      //mã hóa password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      data.password = hashedPassword; //thay thế mật khẩu bằng mật khẩu đã mã hóa

      const userdata = await collection.create(data);
      console.log("User registered successfully:", userdata);
      res.redirect("/");
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

//login
app.post("/signin", async (req, res) => {
  try {
    const user = await collection.findOne({ name: req.body.username });
    if (!user) {
      return res.send("Username not found!");
    }
    //so sánh với mật khẩu đã mã hóa
    const isPassword = await bcrypt.compare(req.body.password, user.password);
    if (isPassword) {
      return res.render("home");
    } else {
      return res.send("Wrong password");
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal Server Error");
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
