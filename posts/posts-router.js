const express = require("express");
const Posts = require("../data/db");
const router = express.Router();

router.get("/api/posts", (req, res) => {
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});

router.get("/api/post/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((posts) => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.post('/api/posts', (req, res) => {
    Posts.insert(req.body)
    .then(post => {
        if(!req.body.title || !req.body.contents) {
            res.status(400).json({error: "Please provide title and contents for the post"})
        } else {
            res.status(201).json(post)
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: "There was an error while saving the comment to the database."
        });
    });
});

router.put("/api/posts/:id", (req, res) => {
  const update = req.body;
  Posts.findById(req.params.id)
    .then(() => {
      if (!update.title || !update.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post.",
        });
      } else {
        Posts.update(req.params.id, update)
          .then(() => {
            res.status(200).json(update);
          })
          .catch((err) => {
            console.log(err);
            res
              .status(500)
              .json({ error: "The post information could not be modified." });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    });
});

router.delete("/api/posts/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      Posts.remove(req.params.id)
        .then(() => {
          res.status(200).json(post);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: "The post could not be removed" });
        });
    })
    .catch((err) => {
      console.log(err);

      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    });
});

router.get("/api/posts/:id/comments", (req, res) => {
    Posts.findPostComments(req.params.id)
      .then((comment) => {
        if (comment.length === 0) {
          res.status(404).json("This comment is non existent");
        } else {
          res.status(200).json(comment);
        }
      })
      .catch((err) => {
        res.status(500).json("Comment not retrieved");
      });
  });

router.post("/api/posts/:id/comments", (req, res) => {
  const id = req.params.id;
  const comment = req.body;
  comment.post_id = Number(id);
  if (!comment.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    Posts.findPostComments(req.params.id)
      .then((comments) => {
        if (comments) {
          Posts.insertComment(comment);
          res.status(201).json(comment);
        } else {
          res.status(404).json({
            message: "The comment with the specified ID does not exist.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: "There was an error while saving the comment to the database",
        });
      });
  }
});

module.exports = router;
