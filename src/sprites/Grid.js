import Phaser from 'phaser'
import Graphlib from "graphlib"

const width = 3;
const defaultColor = 0x0000FF;
const defaultAlpha = 0.8;
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
    this.networkGraph.edges().forEach((edge) => {
      console.log(edge);
      let attributes = this.networkGraph.edge(edge);
      this.lineStyle(width, attributes.color || defaultColor, defaultAlpha);
      let v = this.networkGraph.node(edge.v).server;
      this.moveTo(v.x, v.y);
      let w = this.networkGraph.node(edge.w).server;
      this.lineTo(w.x, w.y);
    })
  }

  shortestPath(src, target) {
    console.debug("Finding shortest path from ", src, target);
    let results = Graphlib.alg.dijkstra(networkGraph, src, ()=>1, (v) => this.networkGraph.nodeEdges(v));
    if (results[target].distance == Number.POSITIVE_INFINITY) {
      return null;
    }
    var path = [target];
    while (results[target].distance > 1) {
      target = results[target].predecessor;
      path.push(target);
    }
    path = path.reverse();
    console.debug("Found", path);
    return path;
  }

}
