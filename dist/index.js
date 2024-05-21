"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
//creating a survey endpoint
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
app.post("/survey", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var body = req.body;
    // res.json(body)
    const createSurvey = yield prisma.survey.findFirst({
        where: {
            survey: body.survey
        }
    });
    if (createSurvey == null) {
        try {
            yield prisma.survey.create({
                data: {
                    survey: body.survey,
                }
            });
        }
        catch (err) {
            res.json(err);
        }
    }
    var id = yield prisma.survey.findMany({
        orderBy: {
            id: "desc"
        },
    });
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield prisma.question.create({
                data: {
                    survey_id: id[0].id,
                    question: body.question,
                    option: body.options
                }
            });
            res.send("Survey successfully created");
        }
        catch (err) {
            res.send(err);
        }
    }), 1500);
}));
//voteview  a survey
app.get("/survey/questionview/:survey_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var survey_id = Number(req.params.survey_id);
    const surveySearch = yield prisma.survey.findFirst({
        where: { id: survey_id }
    });
    if (!surveySearch) {
        res.send("survey doesnt exist");
    }
    else {
        const data = yield prisma.question.findMany({
            where: { survey_id },
            select: {
                id: true,
                question: true,
                option: true
            }
        });
        res.send(JSON.stringify(data));
    }
}));
app.post("/survey/vote/:survey_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var survey_id = Number(req.params.survey_id);
    var vote = req.body;
    console.log(vote);
    var control = [];
    control = vote.data;
    control.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        var questionData;
        try {
            questionData = yield prisma.question.findFirst({
                where: { id: item.q_id },
            });
            console.log(item.q_id);
            console.log(questionData);
        }
        catch (err) {
            console.log("1st" + err);
        }
        if (questionData != null) {
            try {
                var allocation = yield prisma.vote.findFirst({
                    where: { question: questionData.question,
                        vote: item.selectedOption
                    }
                });
                var arr = [];
                if (allocation != null) {
                    allocation.username.map((item1) => {
                        return arr.push(item1);
                    });
                    arr.push(vote.username);
                    try {
                        var data = yield prisma.vote.update({
                            where: { id: allocation.id },
                            data: {
                                username: arr,
                                voteValue: arr.length
                            }
                        });
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
                else {
                    try {
                        var store = [];
                        store.push(vote.username);
                        var result1 = yield prisma.vote.create({
                            data: {
                                question_id: item.q_id,
                                survey_id,
                                username: store,
                                question: questionData.question,
                                vote: item.selectedOption,
                                voteValue: store.length
                            }
                        });
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
            setTimeout(() => {
                res.send("done");
            }, 3000);
        }
    }));
}));
//list of all surveys
app.get('/survey', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var result = yield prisma.question.findMany({
        select: {
            survey: true,
            question: true,
            option: true
        }
    });
    res.send(JSON.stringify(result));
}));
//list of a survey by id
app.get('/survey/:survey_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var survey_id = Number(req.params.survey_id);
    var result = yield prisma.question.findMany({
        where: {
            survey_id
        },
        select: {
            survey: true,
            question: true,
            option: true
        }
    });
    res.send(JSON.stringify(result));
}));
//update a survey by survey_id
app.put("/survey/:survey_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var survey_id = Number(req.params.survey_id);
    var updateData = req.body;
    try {
        yield prisma.survey.update({
            where: { id: survey_id },
            data: {
                survey: updateData.survey
            }
        });
        yield prisma.question.update({
            where: { id: updateData.question_id },
            data: {
                question: updateData.question,
                option: updateData.options
            }
        });
        res.send("updated successfully");
    }
    catch (err) {
        res.send(JSON.stringify(err));
    }
}));
//delete a survey by survey_id
app.delete("/survey/:survey_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const survey_id = Number(req.params.survey_id);
    try {
        yield prisma.survey.delete({
            where: { id: survey_id },
            select: {
                question: true
            }
        });
        res.json('Deleted Successfully');
    }
    catch (err) {
        res.json(err);
    }
}));
//get result of a survey
//if possible , send a much more strucured result of an survey
app.get("/survey/result/:survey_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var survey_id = Number(req.params.survey_id);
    var result = yield prisma.vote.findMany({
        where: { survey_id },
        select: {
            question: true,
            vote: true,
            voteValue: true
        }
    });
    res.send(JSON.stringify(result));
}));
//delete,get result of a survey
app.listen(3000);
