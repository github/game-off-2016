
extends Node

# TODO This doesn't work yet

var timeToLive = 100;

func _ready():
	set_process(true);

func _process(delta):
	if (timeToLive > 0):
		timeToLive -= 10;
	else: 
		get_node(".").remove_child(self.get_path());
	


