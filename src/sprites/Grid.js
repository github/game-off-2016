import Phaser from 'phaser'
import Graphlib from "graphlib"

export const SIMPLE = 'SIMPLE';
export const CAPTURED = 'CAPTURED';
export const ENEMY = 'ENEMY';

const width = 3;
const defaultColor = 0x0000FF;
const defaultAlpha = 0.0;

export default class extends Phaser.Graphics {

  constructor ({ game, networkGraph }) {
    super(game);
    this.game = game;
    this.anchor.setTo(0.5);
    this.networkGraph = networkGraph;
    this.lineStyle(width, defaultColor, defaultAlpha);
    this.render();
  }

  render () {
    this.clear();
    this.networkGraph.edges().forEach((edge) => {
      let attributes = this.networkGraph.edge(edge);
      switch(attributes.type) {
        case CAPTURED:
          this.lineStyle(width, 0x00FF00, 0.8);
          break;
        case ENEMY:
          this.lineStyle(width, 0xFF0000, 0.8);
          break;
        default:
          this.lineStyle(width, defaultColor, defaultAlpha);
          break;
      }
      let v = this.networkGraph.node(edge.v).server;
      this.moveTo(v.x, v.y);
      let w = this.networkGraph.node(edge.w).server;
      this.lineTo(w.x, w.y);
    })
  }

  shortestPath(src, target) {
    console.debug("Finding shortest path from ", src, target);
    let results = Graphlib.alg.dijkstra(networkGraph, src, (e) => this.weightFn(e), (v) => this.networkGraph.nodeEdges(v));
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
