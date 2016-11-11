
extends KinematicBody2D

const MOTION_SPEED = 140;
const DASH_SPEED = 10;
const WALK_SPEED = 200;

var isRunning = false;
var isDashing = false;
var zoomMultiplier = 0;

var velocity = Vector2();

func _ready():
	# Set up animation
	var sprite = get_node("AnimatedSprite");
	sprite.get_sprite_frames().set_animation_speed("run", 10.0);
	set_process(true);
	set_fixed_process(true);

func _process(delta):
	var sprite = get_node("AnimatedSprite");
	
	if (Input.is_action_pressed("ui_up")):
		isRunning = true;
	elif (Input.is_action_pressed("ui_down")):
		isRunning = true;
	elif (Input.is_action_pressed("ui_left")):
		isRunning = true;
		sprite.set_flip_h(true);
	elif (Input.is_action_pressed("ui_right")):
		isRunning = true;
		sprite.set_flip_h(false);
	else:
		isRunning = false;
		
	if (isRunning):
		sprite.play("run");
	else: 
		sprite.play("idle");

func _fixed_process(delta):
	var motion = Vector2();
	if (Input.is_action_pressed("ui_up")):
		velocity.y = -WALK_SPEED
	elif (Input.is_action_pressed("ui_down")):
		velocity.y = WALK_SPEED
	else:
		velocity.y = 0
		
	if (Input.is_action_pressed("ui_left")):
		velocity.x = -WALK_SPEED
	elif (Input.is_action_pressed("ui_right")):
		velocity.x = WALK_SPEED
	else:
		velocity.x = 0
		
	if (Input.is_action_pressed("ui_dash")):
		isDashing = true;
	
	var motion = velocity * delta
	
		
	
	motion = motion.normalized()*MOTION_SPEED*delta;
	if (isDashing):
		motion = motion*DASH_SPEED;
		isDashing = false;
		zoomMultiplier = 1;
	motion = move(motion);
	
	if (zoomMultiplier > 0):
		get_node("Camera2D").set_zoom(Vector2(1, 1));
	
	# TODO:
		# Set limits to dash
		# Add dash "after - image"
		# Camera zoom out on dash, zoom back in on dash