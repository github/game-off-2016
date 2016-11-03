#include "engine\gfx\font\Font.h"
#include "engine\utils\Utilities.h"

void Font::setAlignment( Alignment ALIGN )
{
	m_alignment = ALIGN;
}

void Font::setFont( std::string src )
{
	m_fontSheet = MTexture::getInstance().getUnit( LTexture::getInstance().loadImage( src ) ).getId();
}

void Font::setFontId( GLuint id )
{
	m_fontSheet = id;
}

void Font::setFontSize( Sint32 p_fontSize )
{
	m_fontSize = p_fontSize;
}

GLuint Font::getFontId()
{
	return m_fontSheet;
}

// TODO: Add wrapping text
void Font::print( std::string message, Sint32 x, Sint32 y )
{
	if ( m_fontSheet == 0 ) return;
	// Offset values for wrapping
	GLfloat ox, oy;
	ox = oy = 0;

	switch( m_alignment )
	{
	case ALIGN_LEFT:
		ox = 0;
		break;
	case ALIGN_CENTER:
		ox = GLfloat( GLfloat( -m_fontSize * Sint32( message.length() ) ) / 2.f );
		break;
	case ALIGN_RIGHT:
		ox = GLfloat( GLfloat( -m_fontSize * Sint32( message.length() ) ) );
		break;
	}

	// Texture coordinates
	GLfloat tx, ty;
	glPushMatrix();
	{
		glTranslatef( GLfloat( x ), GLfloat( y ), 0 );
		glBindTexture( GL_TEXTURE_2D, m_fontSheet );
		glBegin( GL_QUADS );
		{
			for ( Uint32 i = 0; i < Uint32( message.length() ); i++ )
			{
				tx = GLfloat( ( message[i] % 16 ) / 16.f );
				ty = GLfloat( floor( message[i] / 16 ) / 16.f );

				glTexCoord2f( GLfloat( tx ), GLfloat( 1.f - ty ) ); glVertex2f( GLfloat( ox ), GLfloat( oy ) );
				glTexCoord2f( GLfloat( tx + 1 / 16.f ), GLfloat( 1.f - ty ) ); glVertex2f( GLfloat( ox + m_fontSize ), GLfloat( oy ) );
				glTexCoord2f( GLfloat( tx + 1 / 16.f ), GLfloat( 1.f - ( ty + 1.f / 16.f ) ) ); glVertex2f( GLfloat( ox + m_fontSize ), GLfloat( oy + m_fontSize ) );
				glTexCoord2f( GLfloat( tx ), GLfloat( 1.f - ( ty + 1.f / 16.f ) ) ); glVertex2f( GLfloat( ox ), GLfloat( oy + m_fontSize ) );
				ox += GLfloat( m_fontSize );
			}
		}
		glEnd();
		glBindTexture( GL_TEXTURE_2D, 0 );
	}
	glPopMatrix();
}
