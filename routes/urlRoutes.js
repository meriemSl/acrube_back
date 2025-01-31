const express = require("express");
const { getOriginUrl, createUrl } = require("../controllers/urlController");

const router = express.Router();


/**
 * @swagger
 * /{shortened_id}:
 *   get:
 *     summary: Redirect to the original URL
 *     tags:
 *       - Get Original URL
 *     description: Redirects to the original URL based on the shortened ID.
 *     parameters:
 *       - in: path
 *         name: shortened_id
 *         required: true
 *         description: The shortened URL ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully redirected to the original URL
 *         content:
 *           text/html:
 *             example: |
 *               <html>
 *                   <head>
 *                       <title>Redirecting...</title>
 *                       <script>
 *                           window.location.href = "https://original-url.com";
 *                       </script>
 *                   </head>
 *                   <body>
 *                       <p>Redirecting to <a href="https://original-url.com">https://original-url.com</a>...</p>
 *                   </body>
 *               </html>
 *       404:
 *         description: URL not found (shortened ID doesn't exist)
 *         content:
 *           application/json:
 *             example: |
 *               {
 *                 "message": "URL not found"
 *               }
 *       400:
 *         description: Error fetching URL
 *         content:
 *           application/json:
 *             example: |
 *               {
 *                 "message": "Error getting URL"
 *               }
 */

router.get("/:shortened_id", getOriginUrl);

/**
 * @swagger
 * /createUrl:
 *   post:
 *     summary: Create a shortened URL
 *     description: Generates a 3-character hash for a given URL and stores it
 *     tags:
 *       - URL Shortener
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - urlInput
 *             properties:
 *               urlInput:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/long-url"
 *     responses:
 *       '201':
 *         description: URL successfully shortened
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "65a1c9a1e8b7f61234b8e7a1"
 *                 originUrl:
 *                   type: string
 *                   example: "https://example.com/long-url"
 *                 hashUrl:
 *                   type: string
 *                   example: "abc"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-12T15:30:45.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-12T15:30:45.000Z"
 *       '409':
 *         description: URL already exists in the system
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "URL already shortened"
 *                 url:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65a1c9a1e8b7f61234b8e7a1"
 *                     originUrl:
 *                       type: string
 *                       example: "https://example.com/long-url"
 *                     hashUrl:
 *                       type: string
 *                       example: "abc"
 *       '400':
 *         description: Invalid request or server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating url shorten"
 */
router.post("/createUrl", createUrl);

module.exports = router;