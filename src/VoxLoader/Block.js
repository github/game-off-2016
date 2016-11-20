var _ = require('lodash');

function rgb2hex(rgb) {
    rgb = rgb.split(',');

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

function Block() {
    this.on = false; //active
    this.dls = false; //drawnLeftSide // Mark if it's drawn by different block
    this.dts = false; //drawnTopSide
    this.dfs = false; //drawnFrontSide
    this.drs = false; //drawnRightSide
    this.dbs = false; //drawnBottomSide
    this.a = 0; //alpha
    this.r = 0;
    this.g = 0;
    this.b = 0;
};

Block.prototype.Create = function(isActive, r, g, b, alpha) {
    this.on = isActive;
    this.a = alpha;
    this.r = r;
    this.g = g;
    this.b = b;
};

Block.prototype.setActive = function(value) {
    this.on = value;
};

Block.prototype.isActive = function() {
    return this.on;
};

Block.prototype.isEmpty = function(){
    return !this.on &&
           !this.dls &&
           !this.dts &&
           !this.dfs &&
           !this.dbs &&
           !this.a &&
           !this.r &&
           !this.g &&
           !this.b;
};

Block.prototype.clean = function(){
  var ret = [];
  _.each(['on', 'dls', 'dts', 'dfs', 'drs', 'dbs', 'a', 'r', 'g', 'b'], (key, index) => {
    if(this[key]){
      ret[index] = this[key];
    }
  });

  return [this.a, rgb2hex([this.r,this.g,this.b].join(','))];

  return ret;
}

module.exports = Block;
