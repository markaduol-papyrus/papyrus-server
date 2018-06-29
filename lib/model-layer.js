const uuid = require('uuid/v4');

module.exports =
class ModelLayer {
  constructor(db) {
    this.db = db;
  }

  /**
   * Create a new portal hosted by the peer with the given ID
   */
  async createPortal({hostPeerId}) {
    const portalId = uuid();
    await this.db.none(
      'INSERT INTO portals (id, host_peer_id) VALUES ($1, $2)',
      [portalId, hostPeerId]
    );
    return portalId;
  }

  /**
   * Find the portal with the given ID
   */
  async findPortal(portalId) {
    try {
       const results = this.db.oneOrNone(
         'SELECT * FROM portals where id = $1', [id]
       );
    } catch(error) {
      return;
    }
  }

  async addPeerToPortal() {

  }

  async isOperational() {
    try {
      await this.db.one('select');
      return true;
    } catch (error) {
      return false;
    }
  }
}
