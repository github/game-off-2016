#include "engine\gfx\gui\console\Console.h"

Console::Console()
{
	m_fontsize = 16;
}

void Console::setDimensions( Vector2< GLfloat > p_dimensions )
{
	m_dimensions = p_dimensions;
}
void Console::print( std::string p_msg, Color p_color )
{
	m_messages.push_back( Message( p_msg, p_color ) );
}
Uint32 Console::getMessageCount()
{
	return Uint32( m_messages.size() );
}

void Console::render()
{
	glPushMatrix();
	{
		Font::getInstance().setFontSize( m_fontsize );
		Font::getInstance().setAlignment( ALIGN_LEFT );
		for( Sint32 i = getMessageCount() - 1; i >= 0; i-- )
		{
			if ( ( i - getMessageCount() + 1 ) * m_fontsize + m_dimensions.y - m_fontsize < 0 ) break;
			glColor3f(	m_messages[i].m_color.r,
						m_messages[i].m_color.b,
						m_messages[i].m_color.g );
			Font::getInstance().print( 
				std::string( m_messages[i].m_message ).substr( 0, min( Sint32( m_dimensions.x / m_fontsize ), Sint32( m_messages[i].m_message.length() ) ) ), 
				0, 
				Sint32( ( i - getMessageCount() + 1 ) * m_fontsize + m_dimensions.y - m_fontsize ) );
		}
	}
	glPopMatrix();
}
