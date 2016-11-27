/**
 * minesweeper websocket handler
 * @author PabloDons
 */
function ms(ip, callbacks) {
    /**
     * @param string ip the websocket ip for the server
     * @param object callbacks object with callback functions that take event argument from websocket
     * @param function callbacks.close function to call when websocket closes
     * @param function callbacks.open --------"-------- when websocket opens
     * @param function callbacks.command ------''------ on command from server. Takes 2 additional arguments
     * @param string callbacks.command[0] command from server
     * @param object callbacks.command[1] data attached to 'command' from server
     */

    var cmds = [
        "getMap",
        "clickBox",
        "flag",
    ];

    this.ws = new WebSocket(ip,"echo-protocol");

    this.ws.addEventListener("open", function(e) {
        this.send("getMap {}");
        callbacks.open(e);
    });
    this.ws.addEventListener("message", function(e) {
        console.log("message from server:");
        console.log(e.data);
        var i = e.data.indexOf(' ');
        var msg = [e.data.slice(0,i), JSON.parse(e.data.slice(i+1))];
        if (cmds.indexOf(msg[0])!==-1) {
            callbacks.command(e,msg[0],msg[1]);
        }
    });
    this.ws.addEventListener("error", function(e) {
        console.error(e);
    });
    this.ws.addEventListener("close", function(e) {
        callbacks.close(e);
    });
}
ms.prototype.send = function(cmd,data){
    this.ws.send(cmd + ' ' + JSON.stringify(data));
};
ms.prototype.end = function(){
    this.ws.close();
};
ms.prototype.restart = function(){
    this.ws.close();
    return new ms(ip, callbacks);
};
