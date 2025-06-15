const express = require("express");
const router = express.Router();
const postController = require("../controllers/PostController");

// Add request logging middleware
router.use((req, res, next) => {
  const endpoint = req.originalUrl;
  const userId = req.headers.userid || req.body.userId || "guest";
  const method = req.method;

  console.log(`${method} ${endpoint} | User: ${userId}`);
  next();
});

// NOTE: Order of routes is important - more specific routes first

// Create a new post
router.post(
  "/create",
  express.json({ limit: "50mb" }),
  postController.createPost
);

// Filter routes
router.get("/filter", postController.filterPosts);

// Free and paid pets
router.get("/free", postController.getFreePets);
router.get("/paid", postController.getPaidPets);

// Get breeds for a species
router.get("/breeds/:species", postController.getBreedsBySpecies);

// User's posts
router.get("/user/:userId", postController.getUserPosts);

// CRUD operations
router.put("/update/:id", postController.updatePost);
router.delete("/delete/:id", postController.deletePost);

// Purchase a pet
router.post("/purchase/:id", postController.purchasePet);

// Get all posts
router.get("/all", postController.getAllPosts);

// Get a single post by ID or slug (this should be last to avoid conflicts)
router.get("/:idOrSlug", postController.getPostByIdOrSlug);

module.exports = router;
