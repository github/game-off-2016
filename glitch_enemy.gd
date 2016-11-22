
extends Node

# member variables here, example:
# var a=2
# var b="textvar"

func _ready():
	var sprite = get_node("AnimatedSprite");
	sprite.get_sprite_frames().set_animation_speed("default", 8.0);


