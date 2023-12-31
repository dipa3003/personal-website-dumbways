const express = require("express");
const path = require("path");
const multer = require("multer");
const config = require("./config/config.json");
const { Sequelize, QueryTypes, ARRAY } = require("sequelize");
const sequelize = new Sequelize(config.development);
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const { durationProject } = require("./services/durationProject.js");
const { listTech } = require("./services/listTech.js");
const { modifyTech } = require("./services/checkedTech.js");
const projects = require("./models").project;
const users = require("./models").user;

// setup multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});
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
    const isLogin = req.session.isLogin;
    const user = req.session.user;

    if (!isLogin) {
        req.flash("danger", "Failed to access Home page! Login to your account first.");
        return res.redirect("/login");
    }
    const userIsLoginId = req.session.isLoginId;
    // const query = `SELECT p.id, p.title, p."dateStart", p."dateEnd", p.description, p.technologies, p.image, p.duration, u.name
    // FROM projects p JOIN users u ON u.id = p.author_id WHERE p.author_id=${userIsLogin}`;
    // const obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    const obj = await projects.findAll({
        where: { author_id: userIsLoginId },
        include: [
            {
                model: users,
                require: true,
            },
        ],
    });
    res.render("index", { dataProjects: obj, isLogin, user });
});

// ROUTE DETAIL PROJECT
app.get("/project/detail/:id", async (req, res) => {
    const isLogin = req.session.isLogin;
    const user = req.session.user;
    const { id } = req.params;

    if (!isLogin) {
        req.flash("danger", "Failed to access detail project! Login to your account first.");
        return res.redirect("/login");
    }
    // const query = `SELECT p.id, p.title, p."dateStart", p."dateEnd", p.description, p.technologies, p.image, p.duration, u.name
    // FROM projects p JOIN users u ON u.id = p.author_id WHERE p.id=${id}`;
    // const obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    const obj = await projects.findOne({
        where: { id: id },
        include: {
            model: users,
            require: true,
        },
    });

    // res.render("detailProject", { data: obj[0], isLogin, user });
    res.render("detailProject", { data: obj, isLogin, user });
});

// ROUTE ADD-PROJECT
app.get("/project", (req, res) => {
    const isLogin = req.session.isLogin;
    const user = req.session.user;

    if (!isLogin) {
        req.flash("danger", "Failed to add project! Login to your account first.");
        return res.redirect("/login");
    }
    res.render("myProject", { isLogin, user });
});

app.post("/project", upload.single("image"), async (req, res) => {
    // const author_id = req.session.user.id;
    const isLoginId = req.session.isLoginId;

    const data = req.body;
    const image = req.file.filename;

    let start = Date.parse(data.dateStart);
    let end = Date.parse(data.dateEnd);

    // import from services/durationProject.js
    const duration = durationProject(start, end);
    const tech = listTech(data.html, data.css, data.js, data.react);

    // const query = `INSERT INTO projects (title,"dateStart","dateEnd",description, technologies, image, duration, author_id) VALUES('${data.title}','${data.dateStart}','${data.dateEnd}','${data.description}',ARRAY [${tech}],'${image}','${duration}', '${author_id}')`;
    // await sequelize.query(query, { type: QueryTypes.INSERT });

    const cobaMap = await projects.create({
        title: `${data.title}`,
        dateStart: `${data.dateStart}`,
        dateEnd: `${data.dateEnd}`,
        description: `${data.description}`,
        technologies: tech,
        image: `${image}`,
        duration: `${duration}`,
        author_id: isLoginId,
    });
    console.log("ini data create model: ", cobaMap);
    req.flash("success", "Successfully add project! Check it in my projects section below.");
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
    // const query = `SELECT * FROM projects WHERE id=${id}`;
    // const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    const obj = await projects.findOne({
        where: { id: id },
    });
    console.log("obj update is: ", obj);

    // import from services/checkedTech.js
    // const checkedTech = modifyTech(obj[0].technologies);
    const checkedTech = modifyTech(obj.technologies);

    // res.render("editProject", { data: obj[0], checkedTech, isLogin, user });
    res.render("editProject", { data: obj, checkedTech, isLogin, user });
});

app.post("/project/edit", upload.single("image"), async (req, res) => {
    const isLoginId = req.session.isLoginId;
    const { id } = req.body;
    const data = req.body;
    const image = req.file.filename;

    let start = Date.parse(data.dateStart);
    let end = Date.parse(data.dateEnd);

    // import from services/durationProject.js & listTech.js
    const duration = durationProject(start, end);
    const tech = listTech(data.html, data.css, data.js, data.react);

    // const query = `UPDATE projects SET title='${data.title}',"dateStart"='${data.dateStart}',"dateEnd"='${data.dateEnd}',description='${data.description}', technologies=ARRAY [${tech}], image='${image}', duration='${duration}' WHERE id=${id}`;
    // await sequelize.query(query, { type: QueryTypes.UPDATE });

    await projects.update(
        {
            title: `${data.title}`,
            dateStart: `${data.dateStart}`,
            dateEnd: `${data.dateEnd}`,
            description: `${data.description}`,
            technologies: tech,
            image: `${image}`,
            duration: `${duration}`,
            author_id: isLoginId,
        },
        {
            where: { id: id },
        }
    );

    req.flash("success", "Successfully edit project!");
    res.redirect("/");
});

// ROUTE DELETE PROJECT
app.get("/project/delete/:id", async (req, res) => {
    const isLogin = req.session.isLogin;
    const { id } = req.params;

    if (!isLogin) {
        req.flash("danger", "Delete failed: Login to your account!");
        return res.redirect("/login");
    }
    // const query = `DELETE FROM projects WHERE id=${id}`;
    // await sequelize.query(query, { type: QueryTypes.DELETE });

    await projects.destroy({
        where: { id: id },
    });
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
    req.flash("success", "Registration success! Login to your account now.");
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
        req.flash("success", "Login success! Manage your project now.");
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
