#pragma once

#include "Container.h"

class ContainerPanel : public Container
{
private:
	Sint8 m_held;
	Vector2<Sint32> m_mousePos;
	Vector2<Sint32> m_contentSize;
public:
	ContainerPanel() {};
	ContainerPanel(std::string p_compName, std::string p_title, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, Sint8 p_colorTheme, bool p_visible, Sint32 p_texture = -1, Sint8 p_textureStyle = 0)
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

	Component* addComponent(Component* p_component, Sint8 p_alignment = PANEL_ALIGN_NONE)
	{
		return Container::addComponent(p_component, p_alignment);
	}

	void input(Sint8& p_interactFlags, Sint8* p_keyStates, Sint8* p_mouseStates, Vector2<Sint32> p_mousePos)
	{
		Container::input(p_interactFlags, p_keyStates, p_mouseStates, p_mousePos);

		m_moveToFront = (m_held != 0);

		if((p_interactFlags & 1) == 0 || m_held)
		{
			if(m_held != 0)
				m_pos = m_pos + (p_mousePos - m_mousePos);
			if(p_mousePos.x - m_pos.x >= 0 && p_mousePos.x - m_pos.x <= m_size.x && 
				p_mousePos.y - m_pos.y >= 0 && p_mousePos.y - m_pos.y <= m_size.y)
			{
				if(p_mouseStates[0] == 1)
					m_held = 2;
				else if(p_mouseStates[0] == 0 || p_mouseStates[0] == 3)
				{
					m_held = 0;
					if(m_pos.x < 0)
						m_pos.x = 0;
					else if(m_pos.x > Sint32(Globals::getInstance().m_screenSize.x - m_size.x))
						m_pos.x = Sint32(Globals::getInstance().m_screenSize.x - m_size.x);
					if(m_pos.y < 24)
						m_pos.y = 24;
					else if(m_pos.y > Sint32(Globals::getInstance().m_screenSize.y - m_size.y))
						m_pos.y = Sint32(Globals::getInstance().m_screenSize.y - m_size.y);
				}

				m_mousePos = p_mousePos;

				if((p_interactFlags & 1) == 0)
					p_interactFlags += 1;
			}
			else
			{
				m_mousePos = p_mousePos;
				if(p_mouseStates[0] == 0 || p_mouseStates[0] == 3)
				{
					m_held = 0;
					if(m_pos.x < 0)
						m_pos.x = 0;
					else if(m_pos.x > Sint32(Globals::getInstance().m_screenSize.x - m_size.x))
						m_pos.x = Sint32(Globals::getInstance().m_screenSize.x - m_size.x);
					if(m_pos.y < 0)
						m_pos.y = 0;
					else if(m_pos.y > Sint32(Globals::getInstance().m_screenSize.x - m_size.x))
						m_pos.y = Sint32(Globals::getInstance().m_screenSize.x - m_size.x);
				}
			}
		}
	}
	void update(GLfloat p_updateTime)
	{
		Container::update(p_updateTime);
	}
	void render()
	{
		if(m_visible)
		{
			if(m_texture != 0)
				Component::renderFill();
			else
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
				Font::getInstance().setFontSize(16);
				Font::getInstance().setAlignment(ALIGN_CENTER);
				Font::getInstance().print(m_title, m_pos.x + m_size.x / 2, m_pos.y + 4);
			}
			Container::render();
		}
	}
};
