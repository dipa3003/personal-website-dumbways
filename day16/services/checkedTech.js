function modifyTech(technologies) {
    let a;
    let b;
    let c;
    let d;

    technologies.forEach((item) => {
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
    const dataChecked = { html: a, css: b, js: c, react: d };
    return dataChecked;
}
module.exports = { modifyTech };
