const express = require('express');
const router = express.Router();

// Require controller modules
const portalController = require('./../controllers/portalController.js');

// Create portal; return share link
router.get('/portals/create', portalController.portalCreate);

// Join portal; return list of peers belonging to portal
router.get('/portals/join/:id', portalController.portalJoin);

// Leave portal
router.post('/portals/leave/:id', portalController.portalLeave);
