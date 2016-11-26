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

    var ws = new WebSocket(ip,"echo-protocol");

    ws.addEventListener("open", function(e) {
        ws.send("getMap {}");
        callbacks.open(e);
    });
    ws.addEventListener("message", function(e) {
        var i = e.data.indexOf(' ');
        var msg = [e.data.slice(0,i), JSON.parse(e.data.slice(i+1))];

        if (cmds[msg[0]]) {
            callbacks.command(e,msg[0],msg[1]);
        }
    });
    ws.addEventListener("error", function(e) {
        console.error(e);
    });
    ws.addEventListener("close", function(e) {
        callbacks.close(e);
    });
}
ms.prototype.end = function(){
    ws.close();
};
ms.prototype.restart = function(){
    ws.close();
    return new ms(ip, callbacks);
};
