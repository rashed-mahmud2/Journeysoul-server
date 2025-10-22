const express = require("express");
const Blog = require("../models/blog.model");
const { checkAuthentication } = require("../middleware/check-auth");

const blogRouter = express.Router();

// 🟢 CREATE a new blog
blogRouter.post("/", checkAuthentication, async (req, res) => {
  try {
    const { title, content, image, category } = req.body;
    const author = req.user._id;

    // ✅ Validate required fields
    if (!title || !content || !image || !category) {
      return res.status(400).json({
        message: "All fields are required (title, content, image, category)",
      });
    }

    const blog = new Blog({ title, content, image, category, author });
    await blog.save();

    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔵 READ all blogs
blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Blogs fetched successfully",
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🟡 READ single blog by ID
blogRouter.get("/:blogId", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🟠 UPDATE a blog (owner or admin)
blogRouter.patch("/:blogId", checkAuthentication, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await Blog.findByIdAndUpdate(req.params.blogId, req.body, {
      new: true,
    });

    res.json({ message: "Blog updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔴 DELETE a blog (owner or admin)
blogRouter.delete("/:blogId", checkAuthentication, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


blogRouter.get("/category", async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      {
        $group: {
          _id: "$category", 
          count: { $sum: 1 }, 
          blogIds: { $push: "$_id" }, 
        },
      },
      { $sort: { count: -1 } }, 
      {
        $project: {
          _id: 0,
          category: "$_id", 
          count: 1,
          blogIds: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Blogs grouped by category",
      totalCategories: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔴 liked or Unlike a blog
blogRouter.post("/:blogId/like", checkAuthentication, async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      blog.likes.pull(userId);
      await blog.save();
      return res.json({
        message: "Unliked successfully",
        likes: blog.likes.length,
      });
    } else {
      // Like
      blog.likes.push(userId);
      await blog.save();
      return res.json({
        message: "Liked successfully",
        likes: blog.likes.length,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// 🟢 POST a comment
blogRouter.post("/:blogId/comments", checkAuthentication, async (req, res) => {
  try {
    const { blogId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const newComment = { user: userId, text };
    blog.comments.push(newComment);
    await blog.save();

    await blog.populate({
      path: `comments.${blog.comments.length - 1}.user`,
      select: "name email",
    });

    const lastComment = blog.comments[blog.comments.length - 1];
    res
      .status(201)
      .json({ message: "Comment added successfully", comment: lastComment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔵 GET all comments for a blog
blogRouter.get("/:blogId/comments", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId).populate(
      "comments.user",
      "name email"
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json({
      message: "Comments fetched successfully",
      comments: blog.comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🟡 UPDATE a comment (owner or admin)
blogRouter.patch(
  "/:blogId/comments/:commentId",
  checkAuthentication,
  async (req, res) => {
    try {
      const { blogId, commentId } = req.params;
      const { text } = req.body;

      const blog = await Blog.findById(blogId);
      if (!blog) return res.status(404).json({ message: "Blog not found" });

      const comment = blog.comments.id(commentId);
      if (!comment)
        return res.status(404).json({ message: "Comment not found" });

      if (
        comment.user.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      comment.text = text;
      await blog.save();
      res.json({ message: "Comment updated successfully", comment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// 🔴 DELETE a comment (owner, blog author, or admin)
blogRouter.delete(
  "/:blogId/comments/:commentId",
  checkAuthentication,
  async (req, res) => {
    try {
      const { blogId, commentId } = req.params;

      const blog = await Blog.findById(blogId);
      if (!blog) return res.status(404).json({ message: "Blog not found" });

      const comment = blog.comments.id(commentId);
      if (!comment)
        return res.status(404).json({ message: "Comment not found" });

      if (
        comment.user.toString() !== req.user._id.toString() &&
        blog.author.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      comment.deleteOne();
      await blog.save();
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = blogRouter;
