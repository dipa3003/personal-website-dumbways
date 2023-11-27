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

// ROUTE HOME
app.get("/", async (req, res) => {
  const query = "SELECT * FROM projects";
  const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
  res.render("index", { dataProjects: obj });
});

app.get("/project", (req, res) => {
  res.render("myProject");
});

// ROUTE DETAIL PROJECT
app.get("/project/detail/:id", async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM projects WHERE id=${id}`;
  const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
  res.render("detailProject", { data: obj[0] });
});

// ROUTE FORM ADD-PROJECT
app.post("/project", upload.single("image"), async (req, res) => {
  const data = req.body;
  const image = req.file.filename;
  console.log("req.body:", data, "req.file.name:", image);

  let start = Date.parse(data.dateStart);
  let end = Date.parse(data.dateEnd);
  let durasi = end - start;

  let day = Math.floor(durasi / 1000 / 60 / 60 / 24);
  let month = Math.floor(day / 30);
  let year = Math.floor(month / 12);
  const duration = year > 0 ? `${year} tahun` : month > 0 ? `${month} bulan` : `${day} hari`;

  const tech = [];
  if (data.html == "on") {
    tech.push("'html5'");
  }
  if (data.css == "on") {
    tech.push("'css3'");
  }
  if (data.js == "on") {
    tech.push("'js'");
  }
  if (data.react == "on") {
    tech.push("'react'");
  }

  const query = `INSERT INTO projects (title,"dateStart","dateEnd",description, technologies, image, duration) VALUES('${data.title}','${data.dateStart}','${data.dateEnd}','${data.description}',ARRAY [${tech}],'${image}','${duration}')`;
  await sequelize.query(query, { type: QueryTypes.INSERT });
  res.redirect("/");
});

// ROUTE UPDATE PROJECT
app.get("/project/edit/:id", async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM projects WHERE id=${id}`;
  const obj = await sequelize.query(query, { type: QueryTypes.SELECT });

  let a;
  let b;
  let c;
  let d;

  obj[0].technologies.forEach((item) => {
    if (item == "html5") {
      a = "checked";
    } else if (item == "css3") {
      b = "checked";
    } else if (item == "js") {
      c = "checked";
    } else if (item == "react") {
      d = "checked";
    }
  });
  const checkedTech = { html: a, css: b, js: c, react: d };
  res.render("editProject", { data: obj[0], checkedTech });
});

app.post("/project/edit", upload.single("image"), async (req, res) => {
  const { id } = req.body;
  const data = req.body;
  const namaImage = req.file;
  console.log("namafile: ", namaImage);
  const image = req.file.filename;

  let start = Date.parse(data.dateStart);
  let end = Date.parse(data.dateEnd);
  let durasi = end - start;

  let day = Math.floor(durasi / 1000 / 60 / 60 / 24);
  let month = Math.floor(day / 30);
  let year = Math.floor(month / 12);
  const duration = year > 0 ? `${year} tahun` : month > 0 ? `${month} bulan` : `${day} hari`;

  const tech = [];

  if (data.html == "on") {
    tech.push("'html5'");
  }
  if (data.css == "on") {
    tech.push("'css3'");
  }
  if (data.js == "on") {
    tech.push("'js'");
  }
  if (data.react == "on") {
    tech.push("'react'");
  }

  const query = `UPDATE projects SET title='${data.title}',"dateStart"='${data.dateStart}',"dateEnd"='${data.dateEnd}',description='${data.description}', technologies=ARRAY [${tech}], image='${image}', duration='${duration}' WHERE id=${id}`;
  await sequelize.query(query, { type: QueryTypes.UPDATE });
  res.redirect("/");
});

// ROUTE DELETE PROJECT
app.get("/project/delete/:id", async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM projects WHERE id=${id}`;
  await sequelize.query(query, { type: QueryTypes.DELETE });
  res.redirect("/");
});

// ROUTE CONTACT
app.get("/contact", (req, res) => {
  res.render("contact");
});

// ROUTE TESTIMONIALS
app.get("/testimonials", (req, res) => {
  res.render("testimonials");
});

app.listen(port, () => {
  console.log(`Personal website | Listening at http://localhost:${port}`);
});
