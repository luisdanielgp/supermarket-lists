const functions = require("firebase-functions");
const express = require("express");
const app = express();
const auth = require("./util/auth");

const { getAllLists } = require("./APIs/lists");

app.get("/lists", getAllLists);

const { postOneList } = require("./APIs/lists");

app.post("/list", postOneList);

const { deleteList } = require("./APIs/lists");

app.delete("/list/:listId", deleteList);

const { editList } = require("./APIs/lists");

app.put("/list/:listId", editList);

const { loginUser } = require("./APIs/users");

app.post("/login", loginUser);

const { signUpUser } = require("./APIs/users");

app.post("/signup", signUpUser);

const { getUserDetail } = require("./APIs/users");

app.get("/user", auth, getUserDetail);

exports.api = functions.https.onRequest(app);
