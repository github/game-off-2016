declare class Stats {
  showPanel(id: number);
  dom: Node;
  begin();
  end();
  update();
}


declare module 'stats.js' {
    export = Stats;
}
