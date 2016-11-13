import Phaser from 'phaser'
import Graphlib from "graphlib"
import { drawDahsedLine } from "../utils"
import randomItem from 'random-item'

export const SIMPLE = 'SIMPLE';
export const CAPTURED = 'CAPTURED';
export const ENEMY = 'ENEMY';

const EDGE_WIDTH = 3;
const EDGE_COLOR = 0x555555;
const EDGE_ALPHA = 0.6;

const BAD_EDGE_WIDTH = 6;
const BAD_EDGE_COLOR = 0x990033;
const BAD_EDGE_ALPHA = 0.7;

const DRAG_DASH_INTERVALS = [4, 4]
const DRAG_WIDTH = 4;
const DRAG_COLOR = 0x333333;
const DRAG_ALPHA = 1;

const BAD_DRAG_ALPHA = 0.8;
const BAD_DRAG_COLOR = 0xff0000;

export default class extends Phaser.Graphics {

  constructor ({ game, networkGraph }) {
    super(game);
    this.game = game;
    this.anchor.setTo(0.5);
    this.networkGraph = networkGraph;
    this.render();
  }

  render (options = {}) {
    this.clear();
    this.networkGraph.edges().forEach((edge) => {
      let attributes = this.networkGraph.edge(edge);
      if (options.intersections && options.intersections.includes(edge)) {
        this.lineStyle(BAD_EDGE_WIDTH, BAD_EDGE_COLOR, BAD_EDGE_ALPHA);
      } else {
        this.lineStyle(EDGE_WIDTH, EDGE_COLOR, EDGE_ALPHA);
      }
      let v = this.networkGraph.node(edge.v).server;
      this.moveTo(v.x, v.y);
      let w = this.networkGraph.node(edge.w).server;
      this.lineTo(w.x, w.y);
    })

    if (options.drag) {
      if (options.intersections&& options.intersections.length > 0) {
        this.lineStyle(DRAG_WIDTH, BAD_DRAG_COLOR, BAD_DRAG_ALPHA);
      } else {
        this.lineStyle(DRAG_WIDTH, DRAG_COLOR, DRAG_ALPHA);
      }
      drawDahsedLine(this, options.drag.origin.x, options.drag.origin.y, options.drag.target.x, options.drag.target.y, DRAG_DASH_INTERVALS)
    }
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

  randomNode(src) {
    const results = Graphlib.alg.dijkstra(networkGraph, src, (e) => this.weightFn(e), (v) => this.networkGraph.nodeEdges(v));
    var keys = Object.keys(results);
    keys.filter((key) => {
      return results[key].distance != Number.POSITIVE_INFINITY && src != key
    })
    return randomItem(keys);
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
