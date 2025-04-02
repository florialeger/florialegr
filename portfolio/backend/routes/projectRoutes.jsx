const express = require("express");
const {
  getProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController.jsx");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API for managing projects
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: The title of the project
 *                   context:
 *                     type: string
 *                     description: The context of the project
 *                   created:
 *                     type: string
 *                     description: The creation date of the project
 *                   slug:
 *                     type: string
 *                     description: The unique slug of the project
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: A single project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the project
 *                 context:
 *                   type: string
 *                   description: The context of the project
 *                 created:
 *                   type: string
 *                   description: The creation date of the project
 *                 slug:
 *                   type: string
 *                   description: The unique slug of the project
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Add a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the project
 *               context:
 *                 type: string
 *                 description: The context of the project
 *               created:
 *                 type: string
 *                 description: The creation date of the project
 *               slug:
 *                 type: string
 *                 description: The unique slug of the project
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the project
 *               context:
 *                 type: string
 *                 description: The context of the project
 *               created:
 *                 type: string
 *                 description: The creation date of the project
 *               slug:
 *                 type: string
 *                 description: The unique slug of the project
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */

router.get("/", getProjects); // Get all projects
router.get("/:id", getProjectById); // Get a single project by ID
router.post("/", addProject); // Add a new project
router.put("/:id", updateProject); // Update a project by ID
router.delete("/:id", deleteProject); // Delete a project by ID

module.exports = router;