import Phaser from 'phaser'
import Graphlib from "graphlib"
import randomItem from 'random-item'

export const SIMPLE = 'SIMPLE';
export const CAPTURED = 'CAPTURED';
export const ENEMY = 'ENEMY';

const EDGE_WIDTH = 3;
const EDGE_COLOR = 0x555555;
const EDGE_ALPHA = 0.8;

export default class extends Phaser.Graphics {

  constructor ({ game, networkGraph }) {
    super(game);
    this.game = game;
    this.anchor.setTo(0.5);
    this.networkGraph = networkGraph;
    this.render();
  }

  render () {
    this.clear();
    this.networkGraph.edges().forEach((edge) => {
      let attributes = this.networkGraph.edge(edge);
      this.lineStyle(EDGE_WIDTH, EDGE_COLOR, EDGE_ALPHA);
      let v = this.networkGraph.node(edge.v).server;
      this.moveTo(v.x, v.y);
      let w = this.networkGraph.node(edge.w).server;
      this.lineTo(w.x, w.y);
    })
  }

  shortestPath(src, target) {
    console.debug("Finding shortest path from ", src, target);
    let results = Graphlib.alg.dijkstra(this.networkGraph, src, (e) => this.weightFn(e), (v) => this.networkGraph.nodeEdges(v));
    if (results[target].distance == Number.POSITIVE_INFINITY) {
      return null;
    }
    var path = [target];
    while (results[target].predecessor != src) {
      target = results[target].predecessor;
      path.push(target);
    }
    path = path.reverse();
    console.debug("Found", path);
    return path;
  }

  randomNode(src) {
    const results = Graphlib.alg.dijkstra(this.networkGraph, src, (e) => this.weightFn(e), (v) => this.networkGraph.nodeEdges(v));
    var keys = Object.keys(results);
    keys = keys.filter((key) => {
      const distance = results[key].distance;
      return distance != Number.POSITIVE_INFINITY && distance > 0;
    })
    return randomItem(keys);
  }

  node(uuid) {
    return this.networkGraph.node(uuid).server;
  }

  pointPath(path) {
    return path.map((uuid) => {
      let s = this.networkGraph.node(uuid).server;
      return {
        x: s.x,
        y: s.y
      }
    });
  }

  weightFn(edge) {
    let attributes = this.networkGraph.edge(edge);
    let v = this.networkGraph.node(edge.v);
    let w = this.networkGraph.node(edge.w);

    let distance = attributes.distance;
    if (v.logic.isEnemy() || w.logic.isEnemy()) distance *= 2;
    switch(attributes.type) {
    case CAPTURED: return distance / 2;
    case ENEMY: return distance * 5;
    default: return distance;
    }
  }

}
