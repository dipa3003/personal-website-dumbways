const express = require("express");
const path = require("path");
const multer = require("multer");
const config = require("./config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");

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
app.use(flash());

// ROUTE HOME
app.get("/", async (req, res) => {
    if (!req.session.isLogin) {
        req.flash("danger", "Login required for access Home!");
        return res.redirect("/login");
    }
    const userIsLogin = req.session.isLoginId;
    const query = `SELECT projects.id, projects.title, projects."dateStart", projects."dateEnd", projects.description, projects.technologies, projects.image, projects.duration, users.name
    FROM projects LEFT JOIN users ON users.id = projects.author_id WHERE projects.author_id=${userIsLogin}`;

    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    console.log("data obj left join: ", obj);

    console.log("req.session: ", req.session);
    const isLogin = req.session.isLogin;
    console.log("islogin: ", isLogin);
    const user = req.session.user;
    console.log("data session:", user);
    res.render("index", { dataProjects: obj, isLogin, user });
});

app.get("/project", (req, res) => {
    const isLogin = req.session.isLogin;
    const user = req.session.user;
    if (!isLogin) {
        req.flash("danger", "Add Project failed: Login to your account!");
        return res.redirect("/login");
    }
    res.render("myProject", { isLogin, user });
});

// ROUTE DETAIL PROJECT
app.get("/project/detail/:id", async (req, res) => {
    const isLogin = req.session.isLogin;
    const user = req.session.user;
    const { id } = req.params;
    // const userIsLogin = req.session.isLoginId;

    const query = `SELECT projects.id, projects.title, projects."dateStart", projects."dateEnd", projects.description, projects.technologies, projects.image, projects.duration, users.name
    FROM projects LEFT JOIN users ON users.id = projects.author_id WHERE projects.id=${id}`;
    // const query = `SELECT * FROM projects WHERE id=${id}`;
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    res.render("detailProject", { data: obj[0], isLogin, user });
});

// ROUTE FORM ADD-PROJECT
app.post("/project", upload.single("image"), async (req, res) => {
    const author_id = req.session.user.id;
    const data = req.body;
    const image = req.file.filename;
    console.log("image name:", image);

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

    const query = `INSERT INTO projects (title,"dateStart","dateEnd",description, technologies, image, duration, author_id) VALUES('${data.title}','${data.dateStart}','${data.dateEnd}','${data.description}',ARRAY [${tech}],'${image}','${duration}', '${author_id}')`;
    await sequelize.query(query, { type: QueryTypes.INSERT });
    req.flash("success", "Successfully add project!");
    res.redirect("/");
});

// ROUTE UPDATE PROJECT
app.get("/project/edit/:id", async (req, res) => {
    const isLogin = req.session.isLogin;
    const user = req.session.user;
    if (!isLogin) {
        req.flash("danger", "Edit failed: Login to your account!");
        return res.redirect("/login");
    }
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
    res.render("editProject", { data: obj[0], checkedTech, isLogin, user });
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
    req.flash("success", "Successfully edit project!");
    res.redirect("/");
});

// ROUTE DELETE PROJECT
app.get("/project/delete/:id", async (req, res) => {
    const isLogin = req.session.isLogin;
    if (!isLogin) {
        req.flash("danger", "Delete failed: Login to your account!");
        return res.redirect("/login");
    }
    const { id } = req.params;
    const query = `DELETE FROM projects WHERE id=${id}`;
    await sequelize.query(query, { type: QueryTypes.DELETE });
    req.flash("success", "Successfully delete project!");
    res.redirect("/");
});

// ROUTE CONTACT
app.get("/contact", (req, res) => {
    const isLogin = req.session.isLogin;
    const user = req.session.user;
    res.render("contact", { isLogin, user });
});
// ROUTE TESTIMONIALS
app.get("/testimonials", (req, res) => {
    const isLogin = req.session.isLogin;
    const user = req.session.user;
    res.render("testimonials", { isLogin, user });
});

// ROUTE REGISTER
app.get("/register", (req, res) => {
    const isLogin = req.session.isLogin;
    const user = req.session.user;
    res.render("register", { isLogin, user });
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
    req.flash("success", "Register success! login to your account now");
    res.redirect("/login");
});

// ROUTE LOGIN
app.get("/login", (req, res) => {
    const isLogin = req.session.isLogin;
    const user = req.session.user;
    res.render("login", { isLogin, user });
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email='${email}'`;
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    if (!obj.length) {
        console.error("user not registered!");
        req.flash("danger", "Login failed: Email is wrong!");
        return res.redirect("/login");
    }

    bcrypt.compare(password, obj[0].password, (err, result) => {
        if (err) {
            console.error("Login failed: Internal server error!");
            req.flash("danger", "Login failed: Internal server error!");
            return res.redirect("/login");
        }
        console.log("result compare password:", result);
        if (!result) {
            console.error("Password is wrong!");
            req.flash("danger", "Login failed: Password is wrong!");
            return res.redirect("/login");
        }
        console.log("Login success! password compare success");
        req.flash("success", "Login success!");
        req.session.isLogin = true;
        req.session.isLoginId = obj[0].id;
        req.session.user = {
            name: obj[0].name,
            email: obj[0].email,
            id: obj[0].id,
        };
        res.redirect("/");
    });
});

// ROUTE LOGOUT
app.get("/logout", (req, res) => {
    req.session.isLogin = false;
    req.flash("success", "Logout success!");
    res.redirect("/login");
});

app.listen(port, () => {
    console.log(`Personal website | Listening at http://localhost:${port}`);
});
