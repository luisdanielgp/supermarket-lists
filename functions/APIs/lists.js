const { db } = require("../util/admin");

exports.getAllLists = (request, response) => {
  db.collection("lists")
    .where("email", "==", request.user.email)
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let lists = [];
      data.forEach((doc) => {
        lists.push({
          listId: doc.id,
          name: doc.data().name,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
        });
      });
      return response.json(lists);
    })
    .catch((err) => {
      console.log("el error es");
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.postOneList = (request, response) => {
  if (request.body.body.trim() === "") {
    return response.status(400).json({ body: "Must not be empty" });
  }
  if (request.body.name.trim() === "") {
    return response.status(400).json({ name: "Must not be empty" });
  }
  const newListItem = {
    email: request.user.email,
    name: request.body.name,
    body: request.body.body,
    createdAt: new Date().toISOString(),
  };
  db.collection("lists")
    .add(newListItem)
    .then((doc) => {
      console.log(doc);
      const responseListItem = newListItem;
      responseListItem.id = doc.id;
      return response.json(responseListItem);
    })
    .catch((err) => {
      response.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};

exports.deleteList = (request, response) => {
  const document = db.doc(`/lists/${request.params.listId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "List not found" });
      }
      if (doc.data().email !== request.user.email) {
        return response.status(403).json({ error: "UnAuthorized" });
      }
      return document.delete();
    })
    .then(() => {
      response.json({ message: "Deleted succesfully" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.editList = (request, response) => {
  if (request.body.listId || request.body.createdAt) {
    response.status(403).json({ message: "Not allowed to edit" });
  }
  let document = db.collection("lists").doc(`${request.params.listId}`);
  document
    .update(request.body)
    .then(() => {
      response.json({ message: "Updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({
        error: err.code,
      });
    });
};
