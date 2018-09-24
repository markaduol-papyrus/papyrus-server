// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const PortalSchema = new Schema({
  portalId: String,
  hostPeerId: String,
  peerIds: [String]
});

// Compile model from schema
const PortalModel = mongoose.model('PortalModel', PortalSchema);
module.exports = PortalModel;
