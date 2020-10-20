import Sessions from './Sessions.js';
import Players from './Players.js';
import Graph from '../common/Graph.js';

class Project {
  constructor(como) {
    this.como = como;
  }

  async init() {
    this.players = new Players(this.como);
    this.sessions = new Sessions(this.como);

    this.state = await this.como.client.stateManager.attach('project');
  }

  subscribe(func) {
    const unsubscribe = this.state.subscribe(func);
    return unsubscribe;
  }

  getValues() {
    return this.state.getValues();
  }

  get(name) {
    return this.state.get(name);
  }

  async createSession(sessionName, presetName) {
    return new Promise((resolve, reject) => {
      const ackChannel = `como:project:createSession:ack`;
      const errChannel = `como:project:createSession:err`;

      const resolvePromise = value => {
        this.como.client.socket.removeAllListeners(ackChannel);
        this.como.client.socket.removeAllListeners(errChannel);
        resolve(value);
      }

      this.como.client.socket.addListener(ackChannel, resolvePromise);
      this.como.client.socket.addListener(errChannel, err => {
        console.log('project:createSession error', err);
        resolvePromise(null);
      });

      this.como.client.socket.send(`como:project:createSession:req`, sessionName, presetName);
    });
  }

  async deleteSession(sessionId) {
    return new Promise((resolve, reject) => {
      const ackChannel = `como:project:deleteSession:ack`;
      const errChannel = `como:project:deleteSession:err`;

      const resolvePromise = value => {
        this.como.client.socket.removeAllListeners(ackChannel);
        this.como.client.socket.removeAllListeners(errChannel);
        resolve(value);
      }

      this.como.client.socket.addListener(ackChannel, resolvePromise);
      this.como.client.socket.addListener(errChannel, err => {
        console.log('project:deleteSession error', err);
        resolvePromise(null);
      });

      this.como.client.socket.send(`como:project:deleteSession:req`, sessionId);
    });
  }

  async createStreamRoute(fromSourceId, toNodeId) {
    return new Promise((resolve, reject) => {
      const ackChannel = `como:routing:createStreamRoute:ack`;
      const errChannel = `como:routing:createStreamRoute:err`;

      const resolvePromise = value => {
        this.como.client.socket.removeAllListeners(ackChannel);
        this.como.client.socket.removeAllListeners(errChannel);
        resolve(value);
      }

      this.como.client.socket.addListener(ackChannel, resolvePromise);
      this.como.client.socket.addListener(errChannel, err => {
        console.log('routing:createStreamRoute error', err);
        resolvePromise(null);
      });

      this.como.client.socket.send(`como:routing:createStreamRoute:req`, fromSourceId, toNodeId);
    });
  }

  async deleteStreamRoute(fromSourceId, toNodeId) {
    return new Promise((resolve, reject) => {
      const ackChannel = `como:routing:deleteStreamRoute:ack`;
      const errChannel = `como:routing:deleteStreamRoute:err`;

      const resolvePromise = value => {
        this.como.client.socket.removeAllListeners(ackChannel);
        this.como.client.socket.removeAllListeners(errChannel);
        resolve(value);
      }

      this.como.client.socket.addListener(ackChannel, resolvePromise);
      this.como.client.socket.addListener(errChannel, err => {
        console.log('routing:deleteStreamRoute error', err);
        resolvePromise(null);
      });

      this.como.client.socket.send(`como:routing:deleteStreamRoute:req`, fromSourceId, toNodeId);
    });
  }

  /**
   * @param {Int} playerId - Id of the player in the como application, the
   *  given `id` should be unique. In most case, the node id
   *  (e.g. soudnworks.client.id) will be a good choice.
   */
  async createPlayer(playerId = null) {
    return this.players.create(playerId);
  }


  async createGraph(session, player, slave) {
    const graphDescription = session.get('graph');
    console.log(graphDescription, session, player, slave);
    const graph = new Graph(this.como, graphDescription, session, player, slave);
    await graph.init();

    return graph;
  }
}

export default Project;
