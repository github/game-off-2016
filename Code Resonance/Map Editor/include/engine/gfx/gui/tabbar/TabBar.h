#pragma once

#include "engine\utils\Utilities.h"
#include "..\base\Component.h"
#include "..\..\font\Font.h"
#include <vector>

struct TabBar : public Component
{
public:
	TabBar() {}

	void setPosition(Vector2<Sint32> p_pos)
	{
		m_pos = p_pos;
	}

	void setWidth(Sint32 p_width)
	{
		m_width = p_width;
	}

	void setSelected(Uint16 p_selected)
	{
		m_selected = p_selected;
	}

	void setTabCount(Uint16 p_num)
	{
		m_numOfTabs = p_num;
		if(m_selected > m_numOfTabs)
			m_selected = m_numOfTabs;
		m_scroll = 0;
	}

	Uint16 getTabCount()
	{
		return m_numOfTabs;
	}

	Uint16 getSelected()
	{
		return m_selected;
	}

	void checkPoint(Vector2<Sint32> p_mousePos)
	{
		p_mousePos = p_mousePos - m_pos;
		if(p_mousePos.x >= 0 && p_mousePos.y >= 0 && p_mousePos.x <= m_width && p_mousePos.y <= 32)
		{
			if(p_mousePos.x >= 0 && p_mousePos.x < 32)
			{
				if(m_scroll > 0)
					m_scroll--;
			}
			else if(p_mousePos.x >= m_width - 32 && p_mousePos.x <= m_width)
			{
				if(m_scroll < (m_numOfTabs + 1) * 32 - m_width + 64)
					m_scroll++;
			}
			else
			{
				p_mousePos.x -= (32 - m_scroll);
				for(Uint16 i = 0; i < (m_numOfTabs + 1); i++)
				{
					if(p_mousePos.x >= i * 32 && p_mousePos.x <= i * 32 + 32)
					{
						m_selected = i;
						return;
					}
				}
			}
		}
	}

	void render()
	{
		Font::getInstance().setAlignment(ALIGN_CENTER);
		Font::getInstance().setFontSize(16);
		glPushMatrix();
		{
			glTranslatef(GLfloat(m_pos.x), GLfloat(m_pos.y), 0);

			glTranslatef(32, 0, 0);
			for(Sint32 i = 0; i < (m_numOfTabs + 1); i++)
			{
				if(i * 32 + 32 - m_scroll <= 0 || i * 32 + 32 - m_scroll > m_width - 32)
					continue;
				glColor3f(1, 1, 1);
				glBegin(GL_QUADS);
				{
					glVertex2f(GLfloat(i * 32 - m_scroll - 1), 0);
					glVertex2f(GLfloat(i * 32 + 32 - m_scroll), 0);
					glVertex2f(GLfloat(i * 32 + 32 - m_scroll), 32);
					glVertex2f(GLfloat(i * 32 - m_scroll - 1), 32);
				}
				glEnd();

				if(m_selected == i)
					glColor3f(0.15f, 0.15f, 0.65f);
				else
					glColor3f(0.15f, 0.15f, 0.15f);
				glBegin(GL_QUADS);
				{
					glVertex2f(GLfloat(i * 32 - m_scroll), 1);
					glVertex2f(GLfloat(i * 32 + 32 - m_scroll - 1), 1);
					glVertex2f(GLfloat(i * 32 + 32 - m_scroll - 1), 31);
					glVertex2f(GLfloat(i * 32 - m_scroll), 31);
				}
				glEnd();

				glColor3f(1, 1, 1);
				Font::getInstance().print(Util::numToString(i, 0), i * 32 + 16 - m_scroll, 8);
			}
			glTranslatef(-32, 0, 0);

			glColor3f(1, 1, 1);
			glBegin(GL_QUADS);
			{
				glVertex2f(0, 0);
				glVertex2f(32, 0);
				glVertex2f(32, 32);
				glVertex2f(0, 32);
			}
			glEnd();

			glColor3f(0.15f, 0.15f, 0.15f);
			glBegin(GL_QUADS);
			{
				glVertex2f(1, 1);
				glVertex2f(31, 1);
				glVertex2f(31, 31);
				glVertex2f(1, 31);
			}
			glEnd();

			glColor3f(1, 1, 1);
			Font::getInstance().print("<", 16, 8);

			glColor3f(1, 1, 1);
			glBegin(GL_QUADS);
			{
				glVertex2f(GLfloat(m_width), 0);
				glVertex2f(GLfloat(m_width - 33), 0);
				glVertex2f(GLfloat(m_width - 33), 32);
				glVertex2f(GLfloat(m_width), 32);
			}
			glEnd();

			glColor3f(0.15f, 0.15f, 0.15f);
			glBegin(GL_QUADS);
			{
				glVertex2f(GLfloat(m_width - 32), 1);
				glVertex2f(GLfloat(m_width - 1), 1);
				glVertex2f(GLfloat(m_width - 1), 31);
				glVertex2f(GLfloat(m_width - 32), 31);
			}
			glEnd();

			glColor3f(1, 1, 1);
			Font::getInstance().print(">", m_width - 16, 8);
		}
		glPopMatrix();
	}
private:
	Vector2<Sint32> m_pos;
	Uint16 m_width;

	Uint16 m_numOfTabs;
	Uint16 m_selected;

	Sint32 m_scroll;
};
