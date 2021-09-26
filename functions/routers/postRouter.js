const router = require("express").Router();
const admin = require("firebase-admin");
const Busboy = require("busboy");

const db = admin.firestore();
const Posts = db.collection("posts");

console.log("---Post Router Initiated---");

//get all posts
router.get("/", async (req, res) => {
  console.log("req.body", req.body);

  const { title, caption, content } = req.body;

  try {
    console.log("---getPosts Initiated---");
    let allPosts = [];
    const postsGetRes = await Posts.orderBy("created", "desc").get();
    postsGetRes.docs.forEach((doc) => {
      console.log("get all docs doc.data()", doc.data());
      var post = doc.data();
      post.id = doc.id;
      allPosts.push(post);
    });
    res.json(allPosts);
  } catch (err) {
    console.log("err", err);
  }
});

//Create Post
router.post("/", (req, res) => {
  console.log("---Post Router: Post Request---");
  // console.log("---Headers---", req.headers);

  const busboy = new Busboy({ headers: req.headers });

  let fields = {};

  busboy.on("field", (fieldname, fieldvalue) => {
    console.log("---postsrouter busboy.on('field') initiated---");
    console.log("fieldname", fieldname);
    fields[fieldname] = fieldvalue;
  });

  busboy.on("finish", async () => {
    console.log("---on.finish initiated---");
    try {
      const { title, caption } = fields;
      var newPostData = {
        title,
        caption,
        creator: "The Man",
        created: admin.firestore.Timestamp.now().seconds,
      };
      const newPostRes = await Posts.add(newPostData);
      console.log("---newPost Success---");
      res.status(200).send(newPostRes.data);
    } catch (err) {
      console.log("post busboy finish err", err);
    }
  });
  console.log("busboy end");
  busboy.end(req.rawBody);
  // res.json("Post Created");
});

router.put("/:id", (req, res) => {
  console.log("---updatePost Initiated---");
  const { id } = req.params;
  const docRef = Posts.doc(id);
  console.log("---docRef id---", id);

  const busboy = new Busboy({ headers: req.headers });
  let fields = {};
  busboy.on("field", (fieldname, fieldvalue) => {
    console.log("---updatePost busboy.on('field') initiated---");
    console.log(fieldname);
    fields[fieldname] = fieldvalue;
  });
  busboy.on("finish", async () => {
    console.log("---on.finish initiated---");
    try {
      const { title, caption } = fields;

      let updatePostRes = db.collection("posts").doc(id).update({
        title: title,
        caption: caption,
      });
      console.log("---updatePost Success---");
      res.status(200).send(updatePostRes.data);
    } catch (err) {
      console.log("post busboy finish err", err);
    }
  });
  busboy.end(req.rawBody);
});

module.exports = router;
