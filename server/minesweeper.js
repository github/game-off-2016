function ms(size, bombP) {
    this.size = size;
    this.map = [];
    this.getMap = [];
    for (var i=0;i<this.size;i++) {
        getMap.push([])
        for (var j=0;j<this.size;i++) {
            getMap[i].push({sel:this.map[i][j].sel});
            if (this.map[i][j].sel) {
                getMap[i][j].numOfAdj = this.map[i][j].numOfAdj;
            }
        }
    }

    for (var i=0;i<size;i++){
        this.map.push([]);
        for (var j=0;j<size;j++){
            var ret = {
                isB:Math.random()<bombP,
                sel:false,
                numOfAdj:0,
            };
            this.map[i].push(ret);
        }
    }

    for (var i=0;i<size;i++){
        for (var j=0;j<size;j++){
            if (this.map[i][j].isB){
                if (i!==0) {
                    this.map[i-1][j].numOfAdj+=1;
                    if (j!==0) {
                        this.map[i-1][j-1].numOfAdj+=1;
                    } if (j!==this.size-1) {
                        this.map[i-1][j+1].numOfAdj+=1;
                    }
                } if (i!==this.size-1) {
                    this.map[i+1][j].numOfAdj+=1;
                    if (j!==0) {
                        this.map[i+1][j-1].numOfAdj+=1;
                    } if (j!==this.size-1) {
                        this.map[i+1][j+1].numOfAdj+=1;
                    }
                }
                if (j!==0) {
                    this.map[i][j-1].numOfAdj+=1;
                } if (j!==this.size-1) {
                    this.map[i][j+1].numOfAdj+=1;
                }
            }
        }
    }
}
ms.prototype.clickBox = function (req) {
    console.log("clickbox called at "+JSON.stringify(req));
    var ret = {hit:false,act:[{x:req.x,y:req.y,numOfAdj:this.map[req.y][req.x].numOfAdj}]};
    if (this.map[req.y][req.x].isB) {
        ret.hit = true;
        return ret;
    }

    if (this.map[req.y][req.x].numOfAdj===0) {
        if (req.y>0) {
            if (!this.map[req.y-1][req.x].sel) {
                this.map[req.y-1][req.x].sel = true;
                ret.act = ret.act.concat(this.clickBox({y:req.y-1, x:req.x}).act);
            }
            if (req.x>0) {
                if (!this.map[req.y-1][req.x-1].sel) {
                    this.map[req.y-1][req.x-1].sel = true;
                    ret.act = ret.act.concat(this.clickBox({y:req.y-1, x:req.x-1}).act);
                }
            } if (req.x<this.size-1) {
                if (!this.map[req.y-1][req.x+1].sel) {
                    this.map[req.y-1][req.x+1].sel = true;
                    ret.act = ret.act.concat(this.clickBox({y:req.y-1, x:req.x+1}).act);
                }
            }
        } if (req.y<this.size-1) {
            if (!this.map[req.y+1][req.x].sel) {
                this.map[req.y+1][req.x].sel = true;
                ret.act = ret.act.concat(this.clickBox({y:req.y+1, x:req.x}).act);
            }
            if (req.x>0) {
                if (!this.map[req.y+1][req.x-1].sel) {
                    this.map[req.y+1][req.x-1].sel = true;
                    ret.act = ret.act.concat(this.clickBox({y:req.y+1, x:req.x-1}).act);
                }
            } if (req.x<this.size-1) {
                if (!this.map[req.y+1][req.x+1].sel) {
                    this.map[req.y+1][req.x+1].sel = true;
                    ret.act = ret.act.concat(this.clickBox({y:req.y+1, x:req.x+1}).act);
                }
            }
        }
        if (req.x>0) {
            if (!this.map[req.y][req.x-1].sel) {
                this.map[req.y][req.x-1].sel = true;
                ret.act = ret.act.concat(this.clickBox({y:req.y, x:req.x-1}).act);
            }
        } if (req.x<this.size-1) {
            if (!this.map[req.y][req.x+1].sel) {
                this.map[req.y][req.x+1].sel = true;
                ret.act = ret.act.concat(this.clickBox({y:req.y, x:req.x+1}).act);
            }
        }
    }
    return ret;
};


module.exports = ms;
