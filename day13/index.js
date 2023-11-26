const express = require("express");
const path = require("path");
const multer = require("multer");
const config = require("./config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);

// setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    // console.log("file:", file);
    cb(null, Date.now() + file.originalname);
  },
});

// middleware multer
const upload = multer({ storage: storage });

// setup express app
const app = express();
const port = 5000;

// setup hbs
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views")); //"views" (di params 1) is constructor for render view html/hbs
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

let dataProjects = [];

app.get("/", async (req, res) => {
  const query = "SELECT * FROM projects";
  const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
  console.log("data dr posgres:", obj);
  console.log("data projects:", dataProjects);
  // res.render("index", { dataProjects });
  res.render("index", { dataProjects: obj });
});

app.get("/project", (req, res) => {
  res.render("myProject");
});

// Route Detail Project
app.get("/project/detail/:index", (req, res) => {
  const { index } = req.params;
  const dataFilter = dataProjects[parseInt(index)];
  // console.log(dataFilter);

  res.render("detailProject", { data: dataFilter });
});

// Route post form add-project
app.post("/project", upload.single("image"), (req, res) => {
  // fetch data req.body dari form add project
  const data = req.body;
  console.log("req.body:", data, "req.file:", req.file);
  const image = req.file.filename;

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

  const tech = [html, css, react, js];

  let dataSubmit = {
    title: data.title,
    description: data.description,
    duration,
    tech,
    image,
    dateStart: data.dateStart,
    dateEnd: data.dateEnd,
  };
  dataProjects.unshift(dataSubmit);

  res.redirect("/");
});

// Route UPDATE project
app.get("/project/edit/:index", (req, res) => {
  const { index } = req.params;
  const dataFilter = dataProjects[parseInt(index)];

  // console.log("dataFilter:", dataFilter);
  const html = dataFilter.tech.html != "" ? "checked" : "";
  const css = dataFilter.tech.css != "" ? "checked" : "";
  const react = dataFilter.tech.react != "" ? "checked" : "";
  const js = dataFilter.tech.js != "" ? "checked" : "";

  const checkedTech = { html, css, react, js };
  // console.log("checkedTech: ", checkedTech);
  res.render("editProject", { data: dataFilter, checkedTech, index });
});

app.post("/project/edit", upload.single("image"), (req, res) => {
  const { index } = req.body;
  const data = req.body;
  const image = req.file.filename;

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

  const editData = {
    title: data.title,
    description: data.description,
    duration,
    tech,
    image,
    dateStart: data.dateStart,
    dateEnd: data.dateEnd,
  };

  dataProjects.splice(index, 1, editData);
  res.redirect("/");
});

// Route DELETE Project
app.get("/project/delete/:index", (req, res) => {
  const { index } = req.params;
  dataProjects.splice(index, 1);
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
