"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffToTopX = exports.getPPDifference = exports.calcPpBoundary = exports.getWhatIfScore = exports.getTotalPlayerPp = exports.getTotalPpFromSortedPps = exports.accFromPpFactor = exports.ppFactorFromAcc = exports.PP_PER_STAR = exports.WEIGHT_COEFFICIENT = void 0;
const scoresaber_js_1 = __importDefault(require("scoresaber.js"));
exports.WEIGHT_COEFFICIENT = 0.965;
exports.PP_PER_STAR = 42.114296;
const ppCurve = [
    { at: 0.0, value: 0.0 },
    { at: 60.0, value: 0.18223233667439062 },
    { at: 65.0, value: 0.5866010012767576 },
    { at: 70.0, value: 0.6125565959114954 },
    { at: 75.0, value: 0.6451808210101443 },
    { at: 80.0, value: 0.6872268862950283 },
    { at: 82.5, value: 0.7150465663454271 },
    { at: 85.0, value: 0.7462290664143185 },
    { at: 87.5, value: 0.7816934560296046 },
    { at: 90.0, value: 0.825756123560842 },
    { at: 91.0, value: 0.8488375988124467 },
    { at: 92.0, value: 0.8728710341448851 },
    { at: 93.0, value: 0.9039994071865736 },
    { at: 94.0, value: 0.9417362980580238 },
    { at: 95.0, value: 1.0 },
    { at: 95.5, value: 1.0388633331418984 },
    { at: 96.0, value: 1.0871883573850478 },
    { at: 96.5, value: 1.1552120359501035 },
    { at: 97.0, value: 1.2485807759957321 },
    { at: 97.25, value: 1.3090333065057616 },
    { at: 97.5, value: 1.3807102743105126 },
    { at: 97.75, value: 1.4664726399289512 },
    { at: 98.0, value: 1.5702410055532239 },
    { at: 98.25, value: 1.697536248647543 },
    { at: 98.5, value: 1.8563887693647105 },
    { at: 98.75, value: 2.058947159052738 },
    { at: 99.0, value: 2.324506282149922 },
    { at: 99.125, value: 2.4902905794106913 },
    { at: 99.25, value: 2.685667856592722 },
    { at: 99.375, value: 2.9190155639254955 },
    { at: 99.5, value: 3.2022017597337955 },
    { at: 99.625, value: 3.5526145337555373 },
    { at: 99.75, value: 3.996793606763322 },
    { at: 99.825, value: 4.325027383589547 },
    { at: 99.9, value: 4.715470646416203 },
    { at: 99.95, value: 5.019543595874787 },
    { at: 100.0, value: 5.367394282890631 },
];
function ppFactorFromAcc(acc) {
    if (!acc || acc <= 0) {
        return 0;
    }
    let index = ppCurve.findIndex(o => o.at >= acc);
    if (index === -1) {
        return ppCurve[ppCurve.length - 1].value;
    }
    if (!index) {
        return ppCurve[0].value;
    }
    let from = ppCurve[index - 1];
    let to = ppCurve[index];
    let progress = (acc - from.at) / (to.at - from.at);
    return from.value + (to.value - from.value) * progress;
}
exports.ppFactorFromAcc = ppFactorFromAcc;
function accFromPpFactor(ppFactor) {
    if (!ppFactor || ppFactor <= 0)
        return 0;
    const idx = ppCurve.findIndex(o => o.value >= ppFactor);
    if (idx < 0)
        return ppCurve[ppCurve.length - 1].at;
    const from = ppCurve[idx - 1];
    const to = ppCurve[idx];
    const progress = (ppFactor - from.value) / (to.value - from.value);
    return from.at + (to.at - from.at) * progress;
}
exports.accFromPpFactor = accFromPpFactor;
const getTotalPpFromSortedPps = (ppArray, startIdx = 0) => ppArray.reduce((cum, pp, idx) => cum + Math.pow(exports.WEIGHT_COEFFICIENT, idx + startIdx) * pp, 0);
exports.getTotalPpFromSortedPps = getTotalPpFromSortedPps;
const getTotalPp = (scores) => scores && Array.isArray(scores) ? (0, exports.getTotalPpFromSortedPps)(scores.map(s => { var _a; return (_a = s === null || s === void 0 ? void 0 : s.score) === null || _a === void 0 ? void 0 : _a.pp; }).sort((a, b) => b - a)) : null;
const convertScoresToObject = (scores, idFunc = (score) => { var _a; return (_a = score === null || score === void 0 ? void 0 : score.leaderboard) === null || _a === void 0 ? void 0 : _a.id; }, asArray = false) => scores.reduce((scoresObj, score) => {
    const _id = idFunc(score);
    if (!_id)
        return scoresObj;
    if (asArray) {
        if (!scoresObj[_id])
            scoresObj[_id] = [];
        scoresObj[_id].push(Object.assign({}, score));
    }
    else {
        scoresObj[_id] = Object.assign({}, score);
    }
    return scoresObj;
}, {});
const getTotalPlayerPp = (scores, modifiedScores = {}) => getTotalPp(Object.values(Object.assign(Object.assign({}, convertScoresToObject(scores)), modifiedScores)));
exports.getTotalPlayerPp = getTotalPlayerPp;
function getWhatIfScore(scores, leaderboardId, pp = 0) {
    const currentTotalPp = (0, exports.getTotalPlayerPp)(scores);
    if (!currentTotalPp)
        return null;
    const newTotalPp = (0, exports.getTotalPlayerPp)(scores, { [leaderboardId]: { score: { pp } } });
    return {
        currentTotalPp,
        newTotalPp,
        diff: newTotalPp - currentTotalPp,
    };
}
exports.getWhatIfScore = getWhatIfScore;
const calcPpBoundary = (rankedScores, expectedPp = 1) => {
    if (!rankedScores || !Array.isArray(rankedScores))
        return null;
    const calcRawPpAtIdx = (bottomScores, idx, expected) => {
        const oldBottomPp = (0, exports.getTotalPpFromSortedPps)(bottomScores, idx);
        const newBottomPp = (0, exports.getTotalPpFromSortedPps)(bottomScores, idx + 1);
        // 0.965^idx * rawPpToFind = expected + oldBottomPp - newBottomPp;
        // rawPpToFind = (expected + oldBottomPp - newBottomPp) / 0.965^idx;
        return (expected + oldBottomPp - newBottomPp) / Math.pow(exports.WEIGHT_COEFFICIENT, idx);
    };
    const rankedScorePps = rankedScores.map(s => { var _a, _b; return (_b = (_a = s === null || s === void 0 ? void 0 : s.score) === null || _a === void 0 ? void 0 : _a.pp) !== null && _b !== void 0 ? _b : 0; }).sort((a, b) => b - a);
    let idx = rankedScorePps.length - 1;
    while (idx >= 0) {
        const bottomSlice = rankedScorePps.slice(idx);
        const bottomPp = (0, exports.getTotalPpFromSortedPps)(bottomSlice, idx);
        bottomSlice.unshift(rankedScorePps[idx]);
        const modifiedBottomPp = (0, exports.getTotalPpFromSortedPps)(bottomSlice, idx);
        const diff = modifiedBottomPp - bottomPp;
        if (diff > expectedPp) {
            return calcRawPpAtIdx(rankedScorePps.slice(idx + 1), idx + 1, expectedPp);
        }
        idx--;
    }
    return calcRawPpAtIdx(rankedScorePps, 0, expectedPp);
};
exports.calcPpBoundary = calcPpBoundary;
//Above code was used from https://github.com/motzel/ppcalc/blob/master/src/
const getPPDifference = async (playerID1, playerID2) => {
    try {
        const player1PP = (await (scoresaber_js_1.default.fetchBasicPlayer(playerID1))).pp;
        const player2PP = (await (scoresaber_js_1.default.fetchBasicPlayer(playerID2))).pp;
        const difference = Math.floor((player2PP - player1PP) * 100) / 100;
        return (difference);
    }
    catch (error) {
        return ("Please double check the scoresaber IDs");
    }
    //console.log(player1PP)
    //console.log(player2PP)
};
exports.getPPDifference = getPPDifference;
const diffToTopX = async (playerID, rank) => {
    try {
        const rankX = (await scoresaber_js_1.default.fetchPlayerByRank(rank)).id;
        return ((0, exports.getPPDifference)(playerID, rankX));
    }
    catch (error) {
        return ("error");
    }
    //console.log(rankX)
};
exports.diffToTopX = diffToTopX;
