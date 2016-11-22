#pragma once

#include "..\base\Component.h"
#include "..\..\font\Font.h"

class Panel : public Component
{
public:
	Panel() {};
	Panel(std::string p_compName, std::string p_title, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, Sint8 p_colorTheme, bool p_visible, Sint32 p_texture = -1, Sint8 p_textureStyle = 0)
	{
		m_compName = p_compName;
		m_title = p_title;
		m_pos = p_pos;
		m_size = p_size;
		m_colorTheme = m_colorThemes[p_colorTheme];
		m_texture = p_texture;
		m_textureStyle = p_textureStyle;
		m_visible = p_visible;

		m_borderThickness = 1;
	}

	void input(Sint8& p_interactFlags, Sint8* p_keyStates, Sint8* p_mouseStates, Vector2<Sint32> p_mousePos)
	{
		if(((p_interactFlags & 1) == 0) &&
			p_mousePos.x - m_pos.x >= 0 && p_mousePos.x - m_pos.x <= m_size.x && 
			p_mousePos.y - m_pos.y >= 0 && p_mousePos.y - m_pos.y <= m_size.y)
			p_interactFlags += 1;
	}
	void update(GLfloat p_updateTime)
	{

	}
	void render()
	{
		if(m_visible)
		{
			if(m_textureStyle != COMPONENT_TEXTURE_STYLE_EMPTY)
			{
				Component::render();
				if(m_title != "")
				{
					m_colorTheme.m_back.useColor();
					glBegin(GL_LINES);
					{
						glVertex2f(GLfloat(m_pos.x), GLfloat(m_pos.y + 24));
						glVertex2f(GLfloat(m_pos.x + m_size.x), GLfloat(m_pos.y + 24));
					}
					glEnd();

					m_colorTheme.m_text.useColor();
					Font::getInstance().setAlignment(ALIGN_CENTER);
					Font::getInstance().setFontSize(16);
					Font::getInstance().print(m_title, m_pos.x + m_size.x / 2, m_pos.y + 4);
				}
			}
		}
	}
};
