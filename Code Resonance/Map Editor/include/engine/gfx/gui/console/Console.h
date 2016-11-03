#pragma once

#include <vector>
#include <stdlib.h>
#include <string>

#include "engine\utils\Utilities.h"
#include "engine\utils\OpenGL.h"

#include "..\..\font\Font.h"

struct Console
{
private:
	Uint16 m_fontsize;

	Vector2< GLfloat > m_dimensions;

	Uint32 m_scroll;

	struct Message
	{
		std::string m_message;
		Color m_color;

		Message( std::string p_msg, Color p_color )
		{
			m_message = p_msg;
			m_color = p_color;
		}
	};
	std::vector<Message> m_messages;
public:
	Console();

	void setDimensions( Vector2< GLfloat > p_dimensions );
	void print( std::string p_msg, Color p_color = Color() );
	Uint32 getMessageCount();

	void render();
};
