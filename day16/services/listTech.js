function listTech(html, css, js, react) {
    let tech = [];
    if (html == "on") {
        tech.push("html5");
    }
    if (css == "on") {
        tech.push("css3");
    }
    if (js == "on") {
        tech.push("js");
    }
    if (react == "on") {
        tech.push("react");
    }
    return tech;
}
module.exports = { listTech };
