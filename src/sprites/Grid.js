import Phaser from 'phaser'
import Graphlib from "graphlib"
import { drawDahsedLine } from "../utils"

export const SIMPLE = 'SIMPLE';
export const CAPTURED = 'CAPTURED';
export const ENEMY = 'ENEMY';

const EDGE_WIDTH = 3;
const EDGE_COLOR = 0x555555;
const EDGE_ALPHA = 0.8;

const DRAG_DASH_INTERVALS = [5,10]
const DRAG_WIDTH = 4;
const DRAG_COLOR = 0x333333;
const DRAG_ALPHA = 0.5;

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

  showDrag(server, pointer) {
    this.render()
    this.lineStyle(DRAG_WIDTH, DRAG_COLOR, DRAG_ALPHA);
    drawDahsedLine(this, server.x, server.y, pointer.x, pointer.y, DRAG_DASH_INTERVALS)
  }

  endDrag() {
    this.render()
  }

  shortestPath(src, target) {
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
