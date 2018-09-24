const PortalModel = require('./../models/portal-model.js');
const uuidv1 = require('uuid/v1');

// Add a new peer to an existing portal
exports.portalJoin = (req, res) => {
  const joiningPeerId = req.body.peerId;
  const targetPortalId = req.params.portalId;

  PortalModel.findOne({portalId: targetPortalId}, (err, doc) => {
    if (err) return handleError(err);

    doc.peerIds.push(joiningPeerId);
    doc.save((err, updatedDoc) => {
      if (err) return handleError(err);
      // Return peer IDs
      res.send(updatedDoc.peerIds);
    });
  });
}

// Create a new portal
exports.portalCreate = (req, res) => {
  const newDoc = {
    portalId: uuidv1(),
    hostPeerId: req.body.peerId,
    peerIds: [req.body.peerId]
  };

  PortalModel.create(newDoc, (err) => {
    if (err) handleError(err);
  });
}

// Leave the portal
exports.portalLeave = (req, res) => {
  PortalModel.findOneAndUpdate({portalId: req.params.portalId}, {
    $pull: {peerIds: req.body.peerId}
  });
}

handleError(err) {
  console.error(err);
}
