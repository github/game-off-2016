extends LineEdit

var tapped = false;
var isInitialized = false;
var originalColor = Color(0.0, 0.0, 0.0);
onready var response_node = get_node("Response");
const terminal_prefix = ">> ";
const terminal_format = ">> %s";

func _ready():
	set_opacity(0);
	originalColor = get_node("Response").get_color("font_color");
	
func _input_event(event):
	if (event.type == InputEvent.MOUSE_BUTTON and event.pressed):
		set_error("test error");
	if (event.type == InputEvent.KEY and event.pressed and event.scancode == KEY_RETURN):
		response_node.add_color_override("font_color", originalColor);
		response_node.set_text(">> " + get_text());
		# Send the action to the event

func initialize(): 
	if (!isInitialized):
		set_opacity(1);
		set_text('');
		response_node.set_text('');
		isInitialized = true;

func close():
	set_opacity(0);
	isInitialized = false;

func set_error(errorMessage): 
	response_node.add_color_override("font_color", Color(1.0, 0.0, 0.0));
	response_node.set_text("ERROR! %s" % errorMessage);