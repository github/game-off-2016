
extends ProgressBar

# member variables here, example:
# var a=2
# var b="textvar"

func _ready():
	# Called every time the node is added to the scene.
	# Initialization here
	set_fixed_process(true)

func _fixed_process(delta):
	var currentMemory = 0
	while (currentMemory < get_max()):
		currentMemory 
		set_value(currentMana)