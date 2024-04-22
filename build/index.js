"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const scoresaber_js_1 = __importDefault(require("scoresaber.js"));
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const port = 8080;
var cors = require('cors');
var ejs = require("ejs");
var fs = require("fs");
app.use(cors());
app.set('view engine', 'ejs');
app.listen(port, () => console.log(`Server listening on port: ${port}`));
app.get('/toPlayer', async function (req, res) {
    var P2;
    P2 = await scoresaber_js_1.default.fetchBasicPlayer(req.query.PlayerSSid.toString());
    var data = {
        "SSid": req.query.SSid,
        "targetSSid": req.query.targetSSid,
        "P2name": P2.name,
        "SERVER": process.env.SERVER,
        "COLOUR": process.env.COLOUR,
        "INTERVAL": process.env.INTERVAL
    };
    if (req.query.PlayerSSid == undefined || req.query.SSid == undefined) {
        res.send("Please Provide your own scoresaber ID and your targets scoresaber ID in the URL <br> Usage: batthew.co.uk:8081/toPlayer?SSid=1234&targetSSid=10");
    }
    fs.readFile("./html/overlayToPlayer.html", "utf-8", (err, html) => {
        res.send(ejs.render(html, data));
    });
});
app.get('/toNum', function (req, res) {
    console.log(process.env.SERVER);
    var data = {
        "SSid": req.query.SSid,
        "num": req.query.num,
        "SERVER": process.env.SERVER,
        "COLOUR": process.env.COLOUR,
        "INTERVAL": process.env.INTERVAL
    };
    console.log(req.query.SSid);
    if (req.query.SSid == undefined || req.query.num == undefined) {
        res.send("Please provide a scoresaber ID and a target number <br> Usage: batthew.co.uk:8081/toNum?SSid=1234&num=10");
        return;
    }
    fs.readFile("./html/overlayToNum.html", "utf-8", (err, html) => {
        res.send(ejs.render(html, data));
    });
});
app.get('/plusOne', function (req, res) {
    var data = {
        "SSid": req.query.SSid,
        "SERVER": process.env.SERVER,
        "COLOUR": process.env.COLOUR,
        "INTERVAL": process.env.ONEPPINTERVAL
    };
    if (req.query.SSid == undefined) {
        res.send("Please provide a scoresaber ID <br> Usage: batthew.co.uk:8081/plusOne?SSid=1234");
        return;
    }
    fs.readFile("./html/overlayPlus1PP.html", "utf-8", (err, html) => {
        res.send(ejs.render(html, data));
    });
});
app.get('/ppToNum', async (req, res) => {
    res.send((await (0, utils_1.diffToTopX)(req.query.SSid, req.query.num)).toString());
});
app.get('/ppToPlayer', async (req, res) => {
    res.send((await (0, utils_1.getPPDifference)(req.query.SSid, req.query.targetSSid)).toString());
});
app.get('/plusOnePP', async (req, res) => {
    var scores = await scoresaber_js_1.default.fetchAllScores(req.query.SSid);
    var onePP = Math.round((0, utils_1.calcPpBoundary)(scores) * 100) / 100;
    if (onePP == null) {
        onePP = -1;
    }
    ;
    res.send(onePP.toString());
});
