import { urlencoded } from "body-parser";
import express from "express";
import hbs from "hbs";

const app = express();
const port = 3000;

// setup hbs
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Personal website | Listening at http://localhost:${port}`);
});
