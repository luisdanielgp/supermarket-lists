const functions = require("firebase-functions");
const express = require("express");
const app = express();
const auth = require("./util/auth");

const { getAllLists } = require("./APIs/lists");

app.get("/lists", auth, getAllLists);

const { postOneList } = require("./APIs/lists");

app.post("/list", auth, postOneList);

const { deleteList } = require("./APIs/lists");

app.delete("/list/:listId", auth, deleteList);

const { editList } = require("./APIs/lists");

app.put("/list/:listId", auth, editList);

const { loginUser } = require("./APIs/users");

app.post("/login", loginUser);

const { signUpUser } = require("./APIs/users");

app.post("/signup", signUpUser);

const { getUserDetail } = require("./APIs/users");

app.get("/user", auth, getUserDetail);

const { updateUserDetails } = require("./APIs/users");

app.post("/user", auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
