const express = require("express");
const path = require("path");
const multer = require("multer");
const config = require("./config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);
const bcrypt = require("bcrypt");
const session = require("express-session");

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

// middleware session
app.use(
    session({
        name: "data user",
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

// ROUTE HOME
app.get("/", async (req, res) => {
    const query = "SELECT * FROM projects";
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    console.log("req.session: ", req.session);
    const isLogin = req.session.isLogin;
    console.log("islogin: ", isLogin);
    const user = req.session.user;
    console.log("data session:", user);
    res.render("index", { dataProjects: obj, isLogin, user });
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

// ROUTE REGISTER
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    const salt = 10;
    bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
            console.error("Password failed to Encrypted!");
            return res.redirect("/register");
        }

        console.log("hash pw:", hash);
        const query = `INSERT INTO users (name,email,password) VALUES('${name}','${email}','${hash}')`;
        await sequelize.query(query, { type: QueryTypes.SELECT });
    });

    console.log("Success register");
    res.redirect("/");
});

// ROUTE LOGIN
app.get("/login", (req, res) => {
    res.render("login");
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email='${email}'`;
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    if (!obj.length) {
        console.error("user not registered!");
        return res.redirect("/login");
    }

    bcrypt.compare(password, obj[0].password, (err, result) => {
        if (err) {
            console.error("Login failed: Internal server error!");
            return res.redirect("/login");
        }
        console.log("result compare password:", result);
        if (!result) {
            console.error("Password is wrong!");
            return res.redirect("/login");
        }
        console.log("Login success! password compare success");
        // console.log("req.session: ", req.session);
        req.session.isLogin = true;
        req.session.user = {
            name: obj[0].name,
            email: obj[0].email,
        };
        res.redirect("/");
    });
});

app.listen(port, () => {
    console.log(`Personal website | Listening at http://localhost:${port}`);
});
