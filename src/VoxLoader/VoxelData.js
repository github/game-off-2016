//==============================================================================
// Author: Nergal
// http://webgl.nu
// Date: 2014-11-17
//==============================================================================
function VoxelData() {
    this.x;
    this.y;
    this.z;
    this.color;

    VoxelData.prototype.Create = function(buffer, i, subSample) {
        this.x = (subSample? buffer[i] & 0xFF / 2 : buffer[i++] & 0xFF);
        this.y = (subSample? buffer[i] & 0xFF / 2 : buffer[i++] & 0xFF);
        this.z = (subSample? buffer[i] & 0xFF / 2 : buffer[i++] & 0xFF);
        this.color = buffer[i] & 0xFF;
    };
}
module.exports = VoxelData;
