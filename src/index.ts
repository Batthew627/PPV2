import * as dotenv from 'dotenv'
dotenv.config()
import ScoreSaberAPI from "scoresaber.js";
import express from 'express';
import { calcPpBoundary, diffToTopX, getPPDifference, } from "./utils";

const app = express();
const port = 8080;
var cors = require('cors')
var ejs = require("ejs")
var fs = require("fs")


app.use(cors())
app.set('view engine', 'ejs');

app.listen(port, () => console.log(`Server listening on port: ${port}`));

app.get('/', function(req, res) {
	res.sendFile('/html/index.html',{root:'./'});
})
app.get('/PPOverlay', function(req, res) {
	res.sendFile('/html/PPOverlay.html',{root:'./'});
});

app.get('/toPlayer', async function(req, res) {

	var P2;
	P2 = await ScoreSaberAPI.fetchBasicPlayer(req.query.PlayerSSid!.toString())
	var data = {
		"SSid" : req.query.SSid,
		"targetSSid" : req.query.targetSSid,
		"P2name" : P2.name,
		"SERVER" : process.env.SERVER,
		"COLOUR" : process.env.COLOUR,
		"INTERVAL" : process.env.INTERVAL
	};
	if (req.query.PlayerSSid == undefined || req.query.SSid == undefined) {
		res.send("Please Provide your own scoresaber ID and your targets scoresaber ID in the URL <br> Usage: batthew.co.uk:8081/toPlayer?SSid=1234&targetSSid=10")
	}
	fs.readFile("./html/overlayToPlayer.html" , "utf-8" , (err : string , html : string) => {
		res.send(ejs.render(html , data))
	})
});

app.get('/toNum', function(req, res) {
	console.log(process.env.SERVER)
	var data = {
		"SSid" : req.query.SSid, 
		"num" : req.query.num,
		"SERVER" : process.env.SERVER,
		"COLOUR" : process.env.COLOUR,
		"INTERVAL" : process.env.INTERVAL
	};
	console.log(req.query.SSid)
	if(req.query.SSid == undefined || req.query.num == undefined){
		res.send("Please provide a scoresaber ID and a target number <br> Usage: batthew.co.uk:8081/toNum?SSid=1234&num=10")
		return
	}
	fs.readFile("./html/overlayToNum.html" , "utf-8" , (err : any , html : any) => {
		res.send(ejs.render(html , data))
	})
});
app.get('/plusOne', function(req, res) {
	var data = {
		"SSid" : req.query.SSid,
		"SERVER" : process.env.SERVER,
		"COLOUR" : process.env.COLOUR,
		"INTERVAL" : process.env.ONEPPINTERVAL
	};
	if(req.query.SSid == undefined){
		res.send("Please provide a scoresaber ID <br> Usage: batthew.co.uk:8081/plusOne?SSid=1234")
		return
	}
	fs.readFile("./html/overlayPlus1PP.html" , "utf-8" , (err : any , html : any) => {
		res.send(ejs.render(html , data))
	})
});


app.get('/ppToNum', async (req :any, res: { send: (arg0: string) => void; }) => {
    res.send((await diffToTopX(req.query.SSid, req.query.num)).toString());
});

app.get('/ppToPlayer', async (req: any, res: { send: (arg0: string) => void; }) => {
    res.send((await getPPDifference(req.query.SSid, req.query.targetSSid)).toString());
});

app.get('/plusOnePP' ,  async (req: any, res: { send: (arg0: string) => void; }) => {
    var scores = await ScoreSaberAPI.fetchAllScores(req.query.SSid);
	var onePP = Math.round(calcPpBoundary(scores)!*100)/100;
	if (onePP == null) {onePP = -1};

	res.send(onePP.toString())
});
