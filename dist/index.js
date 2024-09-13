"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientHeaders = void 0;
var http = require("http");
var dotenv_1 = require("dotenv");
var fs = require("fs");
(0, dotenv_1.config)({
    path: "./.env.local",
});
exports.clientHeaders = process.env.DEV
    ? {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    }
    : {
        "Content-Type": "application/json",
    };
var MEMORY = {
    battery: null,
    ip: null,
    lastPoll: null,
    opening: false,
};
var routes = ["/poll", "/open", "/status"];
var routesFunctions = {};
routes.forEach(function (route) {
    var routeBase = "./routes".concat(route);
    var routePath = fs.existsSync("".concat(routeBase, ".ts"))
        ? "".concat(routeBase, ".ts")
        : "".concat(routeBase, ".js");
    if (fs.existsSync(routePath)) {
        console.log("=> Registering route ".concat(route));
        Promise.resolve("".concat(routePath)).then(function (s) { return require(s); }).then(function (module) {
            routesFunctions[route] = module.default;
        });
    }
});
var server = http.createServer(function (req, res) {
    var url = req.url;
    var route = url.split("?")[0];
    console.log("Request for ".concat(route));
    if (routesFunctions[route]) {
        return routesFunctions[route](req, res, MEMORY);
    }
});
server.listen(process.env.PORT, function () {
    console.log("Server running at http://localhost:".concat(process.env.PORT, "/"));
});
