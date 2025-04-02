const express = require("express");
const {
  getPlaygrounds,
  getPlaygroundById,
  addPlayground,
  updatePlayground,
  deletePlayground,
} = require("../controllers/playgroundController.jsx");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Playgrounds
 *   description: API for managing playgrounds
 */

/**
 * @swagger
 * /api/playgrounds:
 *   get:
 *     summary: Get all playgrounds
 *     tags: [Playgrounds]
 *     responses:
 *       200:
 *         description: A list of playgrounds
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: The title of the playground
 *                   context:
 *                     type: string
 *                     description: The context of the playground
 *                   created:
 *                     type: string
 *                     description: The creation date of the playground
 *                   slug:
 *                     type: string
 *                     description: The unique slug of the playground
 */

/**
 * @swagger
 * /api/playgrounds/{id}:
 *   get:
 *     summary: Get a playground by ID
 *     tags: [Playgrounds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The playground ID
 *     responses:
 *       200:
 *         description: A single playground
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the playground
 *                 context:
 *                   type: string
 *                   description: The context of the playground
 *                 created:
 *                   type: string
 *                   description: The creation date of the playground
 *                 slug:
 *                   type: string
 *                   description: The unique slug of the playground
 *       404:
 *         description: Playground not found
 */

/**
 * @swagger
 * /api/playgrounds:
 *   post:
 *     summary: Add a new playground
 *     tags: [Playgrounds]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the playground
 *               context:
 *                 type: string
 *                 description: The context of the playground
 *               created:
 *                 type: string
 *                 description: The creation date of the playground
 *               slug:
 *                 type: string
 *                 description: The unique slug of the playground
 *     responses:
 *       201:
 *         description: Playground created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/playgrounds/{id}:
 *   put:
 *     summary: Update a playground by ID
 *     tags: [Playgrounds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The playground ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the playground
 *               context:
 *                 type: string
 *                 description: The context of the playground
 *               created:
 *                 type: string
 *                 description: The creation date of the playground
 *               slug:
 *                 type: string
 *                 description: The unique slug of the playground
 *     responses:
 *       200:
 *         description: Playground updated successfully
 *       404:
 *         description: Playground not found
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/playgrounds/{id}:
 *   delete:
 *     summary: Delete a playground by ID
 *     tags: [Playgrounds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The playground ID
 *     responses:
 *       200:
 *         description: Playground deleted successfully
 *       404:
 *         description: Playground not found
 */

router.get("/", getPlaygrounds); // Get all playgrounds
router.get("/:id", getPlaygroundById); // Get a single playground by ID
router.post("/", addPlayground); // Add a new playground
router.put("/:id", updatePlayground); // Update a playground by ID
router.delete("/:id", deletePlayground); // Delete a playground by ID

module.exports = router;