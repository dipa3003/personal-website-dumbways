// import express from "express";
// import path from "path";

const express = require("express");
const path = require("path");

const app = express();
const port = 5000;

// setup hbs
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views")); //"views" (di params 1) is constructor for render view html/hbs
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

let dataProjects = [];

app.get("/", (req, res) => {
  res.render("index", { dataProjects });
});

app.get("/project", (req, res) => {
  res.render("myProject");
});
app.get("/project/detail", (req, res) => {
  res.render("detailProject");
});

// Route post form add-project
app.post("/project", (req, res) => {
  const data = req.body;
  console.log(data);

  // validasi durasi project

  let start = Date.parse(data.dateStart);
  let end = Date.parse(data.dateEnd);
  let durasi = end - start;

  let day = Math.floor(durasi / 1000 / 60 / 60 / 24);
  let month = Math.floor(day / 30);
  let year = Math.floor(month / 12);

  const duration = year > 0 ? `${year} tahun` : month > 0 ? `${month} bulan` : `${day} hari`;

  let dummy = {
    title: data.title,
    description: data.description,
    duration,
  };
  dataProjects.push(dummy);
  // console.log("data form project", data);

  // const inputData = {
  //   name: data.title,
  //   startDate: data.dateStart,
  //   endDate: data.dateEnd,
  //   description: data.description,
  //   datahtml: html,
  //   css,
  //   js,
  //   react,
  //   image,
  //   day,
  //   month,
  //   year,
  // };
  // console.log("inputdata:", inputData);

  // dataProjects.push(inputData);
  res.redirect("/");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/testimonials", (req, res) => {
  res.render("testimonials");
});

app.listen(port, () => {
  console.log(`Personal website | Listening at http://localhost:${port}`);
});
