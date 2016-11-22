
extends TextEdit

# member variables here, example:
# var a=2
# var b="textvar"
var isShowing = false;

func _ready():
	set_self_opacity(0.00);
	set_process(true);

func _process(delta):
	if(Input.action_press("ui_terminal")):
		debug("log");
		isShowing = !isShowing;
		if(isShowing):
			set_self_opacity(0.85);
		else:
			set_self_opacity(0.00);
	


