import ScoreSaberAPI from "scoresaber.js";
import express from 'express';
import { calcPpBoundary, diffToTopX, getPPDifference } from "./utils";


const app = express();
const port = 8081;
var cors = require('cors')
var ejs = require("ejs")
var fs = require("fs")

app.use(cors())
app.set('view engine', 'ejs');

app.listen(port, () => console.log(`Server listening on port: ${port}`));

app.get('/toPlayer', async function(req, res) {
	var P2;
	if (req.query.PlayerSSid != undefined) {
		P2 = await ScoreSaberAPI.fetchBasicPlayer(req.query.PlayerSSid.toString())
	} else {res.send("Bad url error"); return;}
	var data = {"SSid" : req.query.SSid , "PlayerSSid" : req.query.PlayerSSid , "P2name" : P2.name};
	fs.readFile("../html/overlayToPlayer.html" , "utf-8" , (err : string , html : string) => {
		res.send(ejs.render(html , data))
	})
});

app.get('/toNum', function(req, res) {
	var data = {"SSid" : req.query.SSid , "num" : req.query.num};
	fs.readFile("../html/overlayToNum.html" , "utf-8" , (err : any , html : any) => {
		res.send(ejs.render(html , data))
	})
});

app.get('/ppToNum', async (req :any, res: { send: (arg0: string) => void; }) => {
    res.send((await diffToTopX(req.query.SSid, req.query.num)).toString());
});

app.get('/ppToPlayer', async (req: any, res: { send: (arg0: string) => void; }) => {
    res.send((await getPPDifference(req.query.SSid, req.query.PlayerSSid)).toString());
});

app.get('/plusOne' ,  async (req: any, res: { send: (arg0: string) => void; }) => {
    var scores = await ScoreSaberAPI.fetchAllScores(req.query.SSid);
	var onePP = calcPpBoundary(scores);
	if (onePP == null) {onePP = -1};
	res.send(onePP.toString())
});
