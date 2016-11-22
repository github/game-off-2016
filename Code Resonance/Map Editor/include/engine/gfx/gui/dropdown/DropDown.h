#pragma once

#include "..\base\Component.h"
#include <vector>

class CDropDown : public Component
{
private:
	Sint16 m_fontSize;
	Uint16 m_selectedItem;
	Sint32 m_hoverItem;

	bool m_update;

	std::vector<std::string> m_itemList;
public:
	CDropDown(std::string p_compName, std::string p_title, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, Sint16 p_fontSize, Sint8 p_colorTheme = 0)
	{
		m_compName = p_compName;
		m_title = p_title;
		m_pos = p_pos;
		m_size = p_size;
		m_fontSize = p_fontSize;
		m_colorTheme = m_colorThemes[p_colorTheme];

		m_selectedItem = 0;
		m_hoverItem = -1;
	}

	std::string getItem(Uint16 p_index)
	{
		return m_itemList[p_index];
	}
	void addItem(std::string p_item)
	{
		m_itemList.push_back(p_item);
	}
	
	void setSelectedItem(Uint16 p_selectedItem)
	{
		m_selectedItem = p_selectedItem;
		m_update = true;
	}

	void input(Sint8& p_interactFlags, Sint8* p_keyStates, Sint8* p_mouseStates, Vector2<Sint32> p_mousePos)
	{
		p_mousePos = p_mousePos - m_pos;

		m_update = false;
		if((p_interactFlags & 1) == 0)
		{
			if(p_mouseStates[0] == 1)
			{
				if(m_selected == 0)
				{
					if(p_mousePos.x >= 0 && p_mousePos.x < m_size.x &&
						p_mousePos.y >= 0 && p_mousePos.y < m_size.y)
					{
						m_selected = 1;
						p_interactFlags += 1;
					}
				}
				else
				{
					m_selected = 0;
					if(p_mousePos.x >= 0 && p_mousePos.x < m_size.x && p_mousePos.y >= m_size.y && p_mousePos.y < m_size.y * Sint32(m_itemList.size() + 1))
					{
						m_selectedItem = p_mousePos.y / m_size.y - 1;
						m_update = true;
						p_interactFlags += 1;
					}
				}
			}
		}

		if(m_selected != 0)
		{
			if(((p_interactFlags & 1) == 0) && p_mousePos.x >= 0 && p_mousePos.x < m_size.x && p_mousePos.y >= m_size.y && p_mousePos.y < m_size.y * Sint32(m_itemList.size() + 1))
			{
				m_hoverItem = p_mousePos.y / m_size.y - 1;
				p_interactFlags += 1;
			}
			else
				m_hoverItem = -1;
		}
	}
	void update(GLfloat p_deltaUpdate)
	{
		
	}
	void render()
	{
		glPushMatrix();
		{
			glTranslatef(GLfloat(m_pos.x), GLfloat(m_pos.y), 0);

			if(m_selected == 0)
			{
				glBegin(GL_QUADS);
				{
					m_colorTheme.m_back.useColor();
					glVertex2f(-1, -1);
					glVertex2f(GLfloat(m_size.x + 1), -1);
					glVertex2f(GLfloat(m_size.x + 1), GLfloat(m_size.y + 1));
					glVertex2f(-1, GLfloat(m_size.y + 1));

					m_colorTheme.m_fore.useColor();
					glVertex2f(0, -0);
					glVertex2f(GLfloat(m_size.x), -0);
					glVertex2f(GLfloat(m_size.x), GLfloat(m_size.y));
					glVertex2f(0, GLfloat(m_size.y));
				}
				glEnd();
			}
			else
			{
				glBegin(GL_QUADS);
				{
					m_colorTheme.m_back.useColor();
					glVertex2f(-1, -1);
					glVertex2f(GLfloat(m_size.x + 1), -1);
					glVertex2f(GLfloat(m_size.x + 1), GLfloat(m_size.y * (m_itemList.size() + 1) + 1));
					glVertex2f(-1, GLfloat(m_size.y * (m_itemList.size() + 1) + 1));

					m_colorTheme.m_fore.useColor();
					glVertex2f(0, -0);
					glVertex2f(GLfloat(m_size.x), -0);
					glVertex2f(GLfloat(m_size.x), GLfloat(m_size.y * (m_itemList.size() + 1)));
					glVertex2f(0, GLfloat(m_size.y * (m_itemList.size() + 1)));
				}
				glEnd();
			}
			if(m_selected != 0)
			{
				if(m_hoverItem != -1)
				{
					m_colorTheme.m_active.useColor();
					glBegin(GL_QUADS);
					{
						glVertex2f(0, GLfloat(m_hoverItem + 1) * m_size.y);
						glVertex2f(GLfloat(m_size.x), GLfloat(m_hoverItem + 1) * m_size.y);
						glVertex2f(GLfloat(m_size.x), GLfloat(m_hoverItem + 2) * m_size.y);
						glVertex2f(0, GLfloat(m_hoverItem + 2) * m_size.y);
					}
					glEnd();
				}
				if(m_hoverItem != m_selectedItem)
				{
					((m_colorTheme.m_active + m_colorTheme.m_fore) / 2).useColor();
					glBegin(GL_QUADS);
					{
						glVertex2f(0, GLfloat(m_selectedItem + 1) * m_size.y);
						glVertex2f(GLfloat(m_size.x), GLfloat(m_selectedItem + 1) * m_size.y);
						glVertex2f(GLfloat(m_size.x), GLfloat(m_selectedItem + 2) * m_size.y);
						glVertex2f(0, GLfloat(m_selectedItem + 2) * m_size.y);
					}
					glEnd();
				}
			}
			m_colorTheme.m_text.useColor();
			Font::getInstance().setFontSize(m_fontSize);
			Font::getInstance().setAlignment(ALIGN_CENTER);
			Font::getInstance().print(m_title, m_size.x / 2, -m_fontSize);
			Font::getInstance().setAlignment(ALIGN_LEFT);
			glTranslatef(GLfloat(m_size.y - m_fontSize) / 2, GLfloat(m_size.y - m_fontSize) / 2, 0);
			if(m_itemList.size() > 0)
			{
				Font::getInstance().print(m_itemList[m_selectedItem], 0, 0);
				if(m_selected != 0)
				{
					for(Uint16 i = 0; i < m_itemList.size(); i++)
					{
						if(m_hoverItem == i)
							m_colorTheme.m_text.useColor();
						else
							m_colorTheme.m_text.useColor(0.8f);
						Font::getInstance().print(m_itemList[i], 0, (i + 1) * m_size.y);
					}
				}
			}
		}
		glPopMatrix();
	}

	Uint8 isUpdated()
	{
		return m_update;
	}

	Uint16 getSelectedItem()
	{
		return m_selectedItem;
	}
};
