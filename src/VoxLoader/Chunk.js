const Block = require('./Block');
const THREE = require('./ThreeHelpers');
const Utils = require('./Utils');

function Chunk(props) {
    this.wireframe = false;
    this.blockSize = 0.1;
    this.chunkSize = 4;
    this.chunkSizeX = 0;
    this.chunkSizeY = 0;
    this.chunkSizeZ = 0;
    this.posX = 0;
    this.posY = 0;
    this.posZ = 0;
    this.type = "GenericChunk";
    this.activeTriangles = 0;
    this.mesh = undefined;
    this.blocks = undefined;
    this.cid = undefined;
    this.world = null;

    this.isBuilt = false;
    this.avgHeight = 0;
    Object.assign(this, props);
};

Chunk.prototype.Clone = function() {
    var obj = new Chunk();

    obj.wireframe = this.wireframe;
    obj.blockSize = this.blockSize;
    obj.chunkSize = this.chunkSize;
    obj.chunkSizeX = this.chunkSizeX;
    obj.chunkSizeY = this.chunkSizeY;
    obj.chunkSizeZ = this.chunkSizeZ;
    obj.posX = this.posX;
    obj.posY = this.posY;
    obj.posZ = this.posZ;
    obj.type = this.type;
    obj.activeTriangles = this.activeTriangles;
    obj.mesh = this.mesh.clone();
    obj.cid = this.cid;
    obj.avgHeight = this.avgHeight;
    obj.blocks = this.blocks;

    return obj;
};

Chunk.prototype.SetWireFrame = function(val) {
    this.wireframe = val;
    this.Rebuild();
};

Chunk.prototype.GetActiveTriangles = function() {
    return this.activeTriangles;
};

Chunk.prototype.GetAvgHeight = function() {
    return this.avgHeight;
};

Chunk.prototype.GetBoundingBox = function() {
    var minx = this.posX;
    var maxx = this.posX + (this.chunkSizeX*this.blockSize/2);
    var miny = this.posY;
    var maxy = this.posY + (this.chunkSizeY*this.blockSize/2);
    
    // y is actually Z when rotated.
    this.box = {'minx': minx, 'maxx': maxx, 
                'minz': miny, 'maxz': maxy};
};

Chunk.prototype.Explode = function(pos, scale, world) {
    if(scale == undefined) {
        scale = 1;
    }
    this.explodeDelta = 0;

    // For each block create array with color etc and create a particleEngine 
    // with that array. 
    var block = undefined;
    for(var x = 0; x < this.chunkSizeX; x++) {
        for(var y = 0; y < this.chunkSizeY; y++) {
            for(var z = 0; z < this.chunkSizeZ; z++) {
                if(this.blocks[x][y][z].isActive()) {
                    if(Math.random() > 0.85) {
                        block = world.blockPool.Get();

                        if(block != undefined) {
                            block.Create2(pos.x+this.blockSize*x/2,
                                         pos.y+this.blockSize*y/2,
                                         pos.z+this.blockSize*z/2,
                                         (this.blockSize-Math.random()*this.blockSize/2)*scale,
                                         this.blocks[x][y][z].r,
                                         this.blocks[x][y][z].g,
                                         this.blocks[x][y][z].b,
                                         2,
                                         Math.random()*180,
                                         3);
                        }
                    }
                }
            }
        }
    }
};

Chunk.prototype.Rebuild = function() {
   // Create mesh for each block and merge them to one geometry
   // Set each color from block + alpha
   if(this.NoOfActiveBlocks() <= 0) {
       console.log("No active blocks.");
        return;
   }
   
   var b = 0;
   var vertices = [];
   var colors = [];

   // Reset merged blocks
   for(var x = 0; x < this.chunkSizeX; x++) {
       for(var y = 0; y < this.chunkSizeY; y++) {
           for(var z = 0; z < this.chunkSizeZ; z++) {
               this.blocks[x][y][z].dls = false;
               this.blocks[x][y][z].dts = false;
               this.blocks[x][y][z].dfs = false;
               this.blocks[x][y][z].drs = false;
               this.blocks[x][y][z].dbs = false;
           }
       }
   }

   var drawBlock = false;
   for(var x = 0; x < this.chunkSizeX; x++) {
       for(var y = 0; y < this.chunkSizeY; y++) {
           for(var z = 0; z < this.chunkSizeZ; z++) {
                if(this.blocks[x][y][z].isActive() == true) {
                    var sides = 0;

                    drawBlock = false;

                    if(y > 0 && y < this.chunkSizeY-1 && 
                       x > 0 && x < this.chunkSizeX-1 && 
                       z > 0 && z < this.chunkSizeZ-1 ) {
                        if(this.blocks[x-1][y][z].isActive() && 
                           this.blocks[x+1][y][z].isActive() &&
                           this.blocks[x][y][z+1].isActive() &&
                           this.blocks[x][y][z-1].isActive() &&
                           this.blocks[x][y+1][z].isActive() &&
                           this.blocks[x][y-1][z].isActive()) {
                            continue;
                        }                           
                    }
                    
                    // Left side (+X)
                    if(x > 0 ) { 
                        if(!this.blocks[x-1][y][z].isActive()) {
                            drawBlock = true;
                        } 
                    } else {
                        drawBlock = true;
                    }

                    if(drawBlock) {
                        var countX = 0;
                        var countY = 0;
                        if(!this.blocks[x][y][z].dls) {
                            for(var cx = 0; cx < this.chunkSizeY; cx++) {
                               if(y+cx < this.chunkSizeY) {
                                    if(this.blocks[x][y+cx][z].isActive() && !this.blocks[x][y+cx][z].dls &&
                                       this.blocks[x][y+cx][z].r == this.blocks[x][y][z].r &&
                                           this.blocks[x][y+cx][z].g == this.blocks[x][y][z].g &&
                                               this.blocks[x][y+cx][z].b == this.blocks[x][y][z].b)
                                        {
                                            countX++;
                                            var tmpCountY = 0;
                                            for(var cy = 0; cy < this.chunkSizeZ; cy++) {
                                                if(z+cy < this.chunkSizeZ) {
                                                    if(this.blocks[x][y+cx][z+cy].isActive() && !this.blocks[x][y+cx][z+cy].dls &&
                                                       this.blocks[x][y+cx][z+cy].r == this.blocks[x][y][z].r &&
                                                           this.blocks[x][y+cx][z+cy].g == this.blocks[x][y][z].g &&
                                                               this.blocks[x][y+cx][z+cy].b == this.blocks[x][y][z].b)
                                                        {
                                                            tmpCountY++;
                                                        } else {
                                                            break;
                                                        }
                                                }
                                            }
                                            if(tmpCountY < countY || countY == 0) {
                                                countY = tmpCountY;
                                            }
                                            if(tmpCountY == 0 && countY > countX) {
                                                break;
                                            }
                                        } else {
                                            break;
                                        }
                               }
                            }
                            countY--;
                            countX--;
                            for(var x1 = 0; x1 < countX; x1++) {
                                for(var y1 = 0; y1 < countY; y1++) {
                                    if(this.blocks[x][y+x1][z+y1].dls) {
                                        //countY = y1-1;
                                    } else {
                                        this.blocks[x][y+x1][z+y1].dls = true;
                                    }
                                }
                            }
                            this.blocks[x][y][z].dls = true;
                            sides++;
                            vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize-this.blockSize, z*this.blockSize-this.blockSize]);
                            vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize-this.blockSize, z*this.blockSize+(this.blockSize*countY)]);
                            vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize+(this.blockSize*countX), z*this.blockSize+(this.blockSize*countY)]);

                            vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize-this.blockSize, z*this.blockSize-this.blockSize]);
                            vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize+(this.blockSize*countX), z*this.blockSize+(this.blockSize*countY)]);
                            vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize+(this.blockSize*countX), z*this.blockSize-this.blockSize]);

                            for(var i = 0; i < 6; i++) {
                                colors.push([this.blocks[x][y][z].r,
                                            this.blocks[x][y][z].g,
                                            this.blocks[x][y][z].b,
                                            this.blocks[x][y][z].a]);
                            }
                        }
                    }

                    // right side (-X)
                    drawBlock = false;
                    if(x < this.chunkSizeX - 1) {
                        if(!this.blocks[x+1][y][z].isActive()) {
                            drawBlock = true;
                        }
                    } else {
                        drawBlock = true;
                    }

                    if(drawBlock) {
                        var countX = 0;
                        var countY = 0;
                        if(!this.blocks[x][y][z].drs) {
                            for(var cx = 0; cx < this.chunkSizeY; cx++) {
                                if(y+cx < this.chunkSizeY ) {
                                    if(this.blocks[x][y+cx][z].isActive() && !this.blocks[x][y+cx][z].drs &&
                                       this.blocks[x][y+cx][z].r == this.blocks[x][y][z].r &&
                                       this.blocks[x][y+cx][z].g == this.blocks[x][y][z].g &&
                                       this.blocks[x][y+cx][z].b == this.blocks[x][y][z].b )
                                        {
                                            // Check how far we can draw other way
                                            countX++;
                                            var tmpCountY = 0;
                                            for(var cy = 0; cy < this.chunkSizeZ; cy++) {
                                                if(z+cy < this.chunkSizeZ) {
                                                    if(this.blocks[x][y+cx][z+cy].isActive() && !this.blocks[x][y+cx][z+cy].drs &&
                                                       this.blocks[x][y+cx][z+cy].r == this.blocks[x][y][z].r &&
                                                       this.blocks[x][y+cx][z+cy].g == this.blocks[x][y][z].g &&
                                                       this.blocks[x][y+cx][z+cy].b == this.blocks[x][y][z].b )
                                                        {
                                                            tmpCountY++;
                                                        } else {
                                                            break;
                                                        }
                                                }
                                            }
                                            if(tmpCountY < countY || countY == 0) {
                                                countY = tmpCountY;
                                            }
                                            if(tmpCountY == 0 && countY > countX) {
                                                break;
                                            }
                                        } else {
                                            break;
                                        }
                                }
                            }
                            countX--;
                            countY--;
                            for(var x1 = 0; x1 < countX; x1++) {
                                for(var y1 = 0; y1 < countY; y1++) {
                                    if(this.blocks[x][y+x1][z+y1].drs) {
                                     //   countY = y1-1;
                                    } else {
                                        this.blocks[x][y+x1][z+y1].drs = true;
                                    }
                                }
                            }

                            this.blocks[x][y][z].drs = true;
                            sides++;
                            vertices.push([x*this.blockSize, y*this.blockSize-this.blockSize, z*this.blockSize-this.blockSize]);
                            vertices.push([x*this.blockSize, y*this.blockSize+(this.blockSize*countX), z*this.blockSize+(this.blockSize*countY)]);
                            vertices.push([x*this.blockSize, y*this.blockSize-this.blockSize, z*this.blockSize+(this.blockSize*countY)]);

                            vertices.push([x*this.blockSize, y*this.blockSize+(this.blockSize*countX), z*this.blockSize+(this.blockSize*countY)]);
                            vertices.push([x*this.blockSize, y*this.blockSize-this.blockSize, z*this.blockSize-this.blockSize]);
                            vertices.push([x*this.blockSize, y*this.blockSize+(this.blockSize*countX), z*this.blockSize-this.blockSize]);

                            for(var i = 0; i < 6; i++) {
                                colors.push([this.blocks[x][y][z].r,
                                            this.blocks[x][y][z].g,
                                            this.blocks[x][y][z].b,
                                            this.blocks[x][y][z].a]);
                            }
                        }
                     }

                   // Back side (-Z)   
                  drawBlock = false;
                  if(z > 0 ) { //this.chunkSize - 1) {
                      if(!this.blocks[x][y][z-1].isActive()) {
                          drawBlock = true;
                      }
                  } else {
                      drawBlock = true;
                  }
                  if(drawBlock) {
                      sides++;
                      vertices.push([x*this.blockSize, y*this.blockSize, z*this.blockSize-this.blockSize]);
                      vertices.push([x*this.blockSize, y*this.blockSize-this.blockSize, z*this.blockSize-this.blockSize]);
                      vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize-this.blockSize, z*this.blockSize-this.blockSize]);

                      vertices.push([x*this.blockSize, y*this.blockSize, z*this.blockSize-this.blockSize]);
                      vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize-this.blockSize, z*this.blockSize-this.blockSize]);
                      vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize, z*this.blockSize-this.blockSize]);
                      for(var i = 0; i < 6; i++) {
                          colors.push([this.blocks[x][y][z].r,
                                      this.blocks[x][y][z].g,
                                      this.blocks[x][y][z].b,
                                      255]);
                      }
                  }

                    // Front side (+Z)
                  drawBlock = false;
                    if(z < this.chunkSizeZ - 1 ) {
                        if(!this.blocks[x][y][z+1].isActive()) {
                            drawBlock = true;
                       }
                   } else {
                       drawBlock = true;
                   }

                   if(drawBlock) {
                       var countX = 0;
                       var countY = 0;
                       if(!this.blocks[x][y][z].dfs) {
                           for(var cx = 0; cx < this.chunkSizeX; cx++) {
                               if(x+cx < this.chunkSizeX) {
                                   if(this.blocks[x+cx][y][z].isActive() && !this.blocks[x+cx][y][z].dfs &&
                                      this.blocks[x+cx][y][z].r == this.blocks[x][y][z].r &&
                                      this.blocks[x+cx][y][z].g == this.blocks[x][y][z].g &&
                                      this.blocks[x+cx][y][z].b == this.blocks[x][y][z].b) 
                                       {
                                           //this.blocks[x+cx][y][z].dfs = true;
                                           // Check how far we can draw other way
                                           countX++;
                                           var tmpCountY = 0;
                                           for(var cy = 0; cy < this.chunkSizeY; cy++) {
                                               if(y+cy < this.chunkSizeY) {
                                                   if(this.blocks[x+cx][y+cy][z].isActive() && !this.blocks[x+cx][y+cy][z].dfs &&
                                                      this.blocks[x+cx][y+cy][z].r == this.blocks[x][y][z].r &&
                                                      this.blocks[x+cx][y+cy][z].g == this.blocks[x][y][z].g &&
                                                      this.blocks[x+cx][y+cy][z].b == this.blocks[x][y][z].b) 
                                                       {
                                                           tmpCountY++;
                                                       } else {
                                                           break;
                                                       }
                                               }
                                           }
                                           if(tmpCountY < countY || countY == 0) {
                                               countY = tmpCountY;
                                           }
                                           if(tmpCountY == 0 && countY > countX) {
                                               break;
                                           }
                                       } else {
                                           break;
                                       }
                               }
                           }
                            countX--;
                            countY--;
                           for(var x1 = 0; x1 < countX; x1++) {
                               for(var y1 = 0; y1 < countY; y1++) {
                                   if(this.blocks[x+x1][y+y1][z].dfs) {
                                       //countY = y1-1;
                                   } else {
                                       this.blocks[x+x1][y+y1][z].dfs = true;
                                   }
                               }
                           }
                           this.blocks[x][y][z].dfs = true;
                           sides++;
                           vertices.push([x*this.blockSize+(this.blockSize*countX), y*this.blockSize+(this.blockSize*countY), z*this.blockSize]);
                           vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize+(this.blockSize*countY), z*this.blockSize]);
                           vertices.push([x*this.blockSize+(this.blockSize*countX), y*this.blockSize-this.blockSize, z*this.blockSize]);

                           vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize+(this.blockSize*countY), z*this.blockSize]);
                           vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize-this.blockSize, z*this.blockSize]);
                           vertices.push([x*this.blockSize+(this.blockSize*countX), y*this.blockSize-this.blockSize, z*this.blockSize]);

                           for(var i = 0; i < 6; i++) {
                               colors.push([this.blocks[x][y][z].r*shade,
                                           this.blocks[x][y][z].g*shade,
                                           this.blocks[x][y][z].b*shade,
                                           255]);
                           }
                       }
                   } 

                    // top (+Y) 
                    drawBlock = false;
                   if(y < this.chunkSizeY - 1) {
                       if(!this.blocks[x][y+1][z].isActive()) {
                           drawBlock = true;
                       }
                   } else {
                       drawBlock = true;
                   }
                   
                   if(drawBlock) {
                       var shade = 0.87;
                       var countX = 0;
                       var countY = 0;
                       if(!this.blocks[x][y][z].dts) {
                           for(var cx = 0; cx < this.chunkSizeX; cx++) {
                               if(x+cx < this.chunkSizeX) {
                                   if(this.blocks[x+cx][y][z].isActive() && !this.blocks[x+cx][y][z].dts &&
                                      this.blocks[x+cx][y][z].r == this.blocks[x][y][z].r &&
                                      this.blocks[x+cx][y][z].g == this.blocks[x][y][z].g &&
                                      this.blocks[x+cx][y][z].b == this.blocks[x][y][z].b) 
                                       {
                                           countX++;
                                           var tmpCountY = 0;
                                           for(var cy = 0; cy < this.chunkSizeZ; cy++) {
                                               if(z+cy < this.chunkSizeZ) {
                                                   if(this.blocks[x+cx][y][z+cy].isActive() && !this.blocks[x+cx][y][z+cy].dts &&
                                                      this.blocks[x+cx][y][z+cy].r == this.blocks[x][y][z].r &&
                                                      this.blocks[x+cx][y][z+cy].g == this.blocks[x][y][z].g &&
                                                      this.blocks[x+cx][y][z+cy].b == this.blocks[x][y][z].b) 
                                                       {
                                                           tmpCountY++;
                                                       } else {
                                                           break;
                                                       }
                                               }
                                           }
                                           if(tmpCountY < countY || countY == 0) {
                                               countY = tmpCountY;
                                           }
                                           if(tmpCountY == 0 && countY > countX) {
                                               break;
                                           }
                                       } else {
                                           break;
                                       }
                               }
                           }
                            countX--;
                            countY--;
                           for(var x1 = 0; x1 < countX; x1++) {
                               for(var y1 = 0; y1 < countY; y1++) {
                                   if(this.blocks[x+x1][y][z+y1].dts) {
                                     //  countY = y1-1;
                                   } else {
                                       this.blocks[x+x1][y][z+y1].dts = true;
                                   }
                               }
                           }

                           this.blocks[x][y][z].dts = true;
                           sides++;
                           vertices.push([x*this.blockSize+(this.blockSize*countX), y*this.blockSize, z*this.blockSize+(this.blockSize*countY)]);
                           vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize, z*this.blockSize-this.blockSize]);
                           vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize, z*this.blockSize+(this.blockSize*countY)]);

                           vertices.push([x*this.blockSize+(this.blockSize*countX), y*this.blockSize, z*this.blockSize+(this.blockSize*countY)]);
                           vertices.push([x*this.blockSize+(this.blockSize*countX), y*this.blockSize, z*this.blockSize-this.blockSize]);
                           vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize, z*this.blockSize-this.blockSize]);
                           
                           for(var i = 0; i < 6; i++) {
                               colors.push([this.blocks[x][y][z].r*shade,
                                           this.blocks[x][y][z].g*shade,
                                           this.blocks[x][y][z].b*shade,
                                           255]);
                           }
                       }
                   }

                    // Bottom (-Y)
                    drawBlock = false;
                   if(y > 0 ) { 
                       if(!this.blocks[x][y-1][z].isActive()) {
                           drawBlock = true;
                       }
                   } else {
                       drawBlock = true;
                   }

                   if(drawBlock) {
                       var countX = 0;
                       var countY = 0;
                       if(!this.blocks[x][y][z].dbs) {
                           for(var cx = 0; cx < this.chunkSizeX; cx++) {
                               if(x+cx < this.chunkSizeX) {
                                   if(this.blocks[x+cx][y][z].isActive() && !this.blocks[x+cx][y][z].dbs &&
                                      this.blocks[x+cx][y][z].r == this.blocks[x][y][z].r &&
                                      this.blocks[x+cx][y][z].g == this.blocks[x][y][z].g &&
                                      this.blocks[x+cx][y][z].b == this.blocks[x][y][z].b) 
                                       {
                                           countX++;
                                           var tmpCountY = 0;
                                           for(var cy = 0; cy < this.chunkSizeZ; cy++) {
                                               if(z+cy < this.chunkSizeZ) {
                                                   if(this.blocks[x+cx][y][z+cy].isActive() && !this.blocks[x+cx][y][z+cy].dbs &&
                                                      this.blocks[x+cx][y][z+cy].r == this.blocks[x][y][z].r &&
                                                      this.blocks[x+cx][y][z+cy].g == this.blocks[x][y][z].g &&
                                                      this.blocks[x+cx][y][z+cy].b == this.blocks[x][y][z].b) 
                                                       {
                                                           tmpCountY++;
                                                       } else {
                                                           break;
                                                       }
                                               }
                                           }
                                           if(tmpCountY < countY || countY == 0) {
                                               countY = tmpCountY;
                                           }
                                           if(tmpCountY == 0 && countY > countX) {
                                               break;
                                           }
                                       } else {
                                           break;
                                       }
                               }
                           }
                            countX--;
                            countY--;
                           for(var x1 = 0; x1 < countX; x1++) {
                               for(var y1 = 0; y1 < countY; y1++) {
                                   if(this.blocks[x+x1][y][z+y1].dbs) {
                                     //  countY = y1-1;
                                   } else {
                                       this.blocks[x+x1][y][z+y1].dbs = true;
                                   }
                               }
                           }
                         
                           this.blocks[x][y][z].dbs = true;
                           sides++;

                           vertices.push([x*this.blockSize+(this.blockSize*countX), y*this.blockSize-this.blockSize, z*this.blockSize+(this.blockSize*countY)]);
                           vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize-this.blockSize, z*this.blockSize+(this.blockSize*countY)]);
                           vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize-this.blockSize, z*this.blockSize-this.blockSize]);

                           vertices.push([x*this.blockSize+(this.blockSize*countX), y*this.blockSize-this.blockSize, z*this.blockSize+(this.blockSize*countY)]);
                           vertices.push([x*this.blockSize-this.blockSize, y*this.blockSize-this.blockSize, z*this.blockSize-this.blockSize]);
                           vertices.push([x*this.blockSize+(this.blockSize*countX), y*this.blockSize-this.blockSize, z*this.blockSize-this.blockSize]);

                           for(var i = 0; i < 6; i++) {
                               colors.push([this.blocks[x][y][z].r,
                                           this.blocks[x][y][z].g,
                                           this.blocks[x][y][z].b,
                                           255]);
                           }
                       }
                   }
                    
                    b += 2*sides;
                }                    
           }
       }
   }
   // Create Object
   //
   var geometry = new THREE.BufferGeometry();
   var v = new THREE.BufferAttribute( new Float32Array( vertices.length * 3), 3 );
   for ( var i = 0; i < vertices.length; i++ ) {
       v.setXYZ(i, vertices[i][0], vertices[i][1], vertices[i][2]);
      // console.log(i + ", "+ vertices[i][0] + ", "+ vertices[i][1]+ ", "+ vertices[i][2]);
   }
   geometry.addAttribute( 'position', v );

   var c = new THREE.BufferAttribute(new Float32Array( colors.length *4), 4 );
   for ( var i = 0; i < colors.length; i++ ) {
       c.setXYZW( i, colors[i][0]/255, colors[i][1]/255, colors[i][2]/255, colors[i][3]/255);
      // c.setXYZW( i, Math.random(), Math.random(), Math.random(), Math.random() );
   }
   geometry.addAttribute( 'color', c );

   geometry.computeBoundingBox();

   // geometry.applyMatrix( new THREE.Matrix4().makeTranslation( -geometry.boundingBox.max.x/2,
   //                                                           -geometry.boundingBox.max.z/2,
   //                                                           0));
   geometry.computeVertexNormals();

  var material3 = new THREE.MeshLambertMaterial({ vertexColors: THREE.VertexColors, wireframe: this.wireframe});

  // geometry.center();
   var mesh = new THREE.Mesh( geometry, material3);
   mesh.rotation.set(-Math.PI/2, 0, Math.PI);
   
   mesh.castShadow = true;
   mesh.receiveShadow = true;

   mesh.position.set(0, 0 , 0);
   mesh.that = this;
   this.mesh = mesh;
   this.GetBoundingBox();
   this.isBuilt = true;
   Utils.Log("VOX Model CREATED TRIANGLES: "+b);
}; 

Chunk.prototype.Destroy = function() {
    var x = ((this.mesh.pos.getX()-this.posX)/this.blockSize);
    var y = ((this.mesh.pos.getY()-this.posY)/this.blockSize);

    if(x >= 0 && x < this.blocks.length && y >= 0 && y < this.blocks.length) {
        if(this.blocks[x][y][z].isActive()) {
            this.blocks[x][y][z].setActive(false);
            this.Rebuild();
            console.log("Destroy block: "+x + ", "+y+", "+z);
            return true;
        }
    }
    return false;
};

Chunk.prototype.ActivateBlock = function(x, y, z, color) {
    if(color.a == 0) {
        this.blocks[x][y][z].setActive(false);
    } else {
        this.blocks[x][y][z].setActive(true);
    }
    this.blocks[x][y][z].r = color.r;
    this.blocks[x][y][z].g = color.g;
    this.blocks[x][y][z].b = color.b;
    this.blocks[x][y][z].a = color.a;
};

Chunk.prototype.Create = function(sizex, sizey, sizez) {        
    this.chunkSizeX = sizex;
    this.chunkSizeY = sizey;
    this.chunkSizeZ = sizez;
    console.log("Create: "+sizex + ", "+sizey + ", "+sizez);
    this.blocks = new Array();


    for(var x = 0; x < sizex; x++) {
        this.blocks[x] = new Array();
        for(var y = 0; y < sizey; y++) {
            this.blocks[x][y] = new Array();
            for(var z = 0; z < sizez; z++) {
                this.blocks[x][y][z] = new Block();
                this.blocks[x][y][z].Create(false, 0, 0, 0, 0);
            }
        }
    }
};

Chunk.prototype.NoOfActiveBlocks = function() {
    var b = 0;
    if(this.blocks != undefined) {
        for(var x = 0; x < this.chunkSizeX; x++) {
            for(var y = 0; y < this.chunkSizeY; y++) {
                for(var z = 0; z < this.chunkSizeZ; z++) {
                    if(this.blocks[x][y][z].isActive()) {
                        b++;
                    }
                }
            }
        }
    } else {
        console.log("UNDEFINED BLOCKS");
    }
    return b;
};

module.exports = Chunk;

