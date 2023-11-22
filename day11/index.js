// import express from "express";
// import path from "path";

const express = require("express");
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "/public/uploads",
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage });

const app = express();
const port = 5000;

// setup hbs
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views")); //"views" (di params 1) is constructor for render view html/hbs
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("uploads"));
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
app.post("/project", upload.single("image"), (req, res) => {
  const image = req.file;
  const data = req.body;
  console.log(data, "image:", image);

  // validasi durasi project
  let start = Date.parse(data.dateStart);
  let end = Date.parse(data.dateEnd);
  let durasi = end - start;

  let day = Math.floor(durasi / 1000 / 60 / 60 / 24);
  let month = Math.floor(day / 30);
  let year = Math.floor(month / 12);

  const duration = year > 0 ? `${year} tahun` : month > 0 ? `${month} bulan` : `${day} hari`;

  // kondisi render logo
  const html = data.html == "on" ? `<i class="fa-brands fa-html5 fa-2xl"></i>` : "";
  const css = data.css == "on" ? `<i class="fa-brands fa-css3-alt fa-2xl"></i>` : "";
  const js = data.js == "on" ? `<i class="fa-brands fa-js fa-2xl"></i>` : "";
  const react = data.react == "on" ? `<i class="fa-brands fa-react fa-2xl"></i>` : "";

  const tech = {
    html,
    css,
    react,
    js,
  };

  let dataSubmit = {
    title: data.title,
    description: data.description,
    duration,
    tech,
  };
  dataProjects.unshift(dataSubmit);

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
