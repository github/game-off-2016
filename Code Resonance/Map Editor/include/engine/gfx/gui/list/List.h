#pragma once

#include "engine\utils\Globals.h"
#include "engine\utils\Utilities.h"
#include "..\base\Component.h"
#include "..\..\font\Font.h"

class CList : public Component
{
private:
	Uint16 m_selectedItem;
	Uint16 m_itemHeight;

	Sint16 m_scroll, m_maxScroll;

	Vector2<Uint16> m_mouseBuffer;

	bool m_hover, m_dragging;
	Uint8 m_update;

	Texture m_tileSheet;

	struct ListItem
	{
		std::string m_name;
		Uint16 m_texId;

		ListItem(std::string p_name, Uint16 p_texId)
		{
			m_name = p_name;
			m_texId = p_texId;
		}
	};
	std::vector<ListItem> m_itemList;
public:
	CList(std::string p_compName, std::string p_title, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, Uint16 p_itemHeight, Texture p_tileSheet, Sint8 p_colorTheme = 0)
	{
		m_compName = p_compName;
		m_title = p_title;
		m_pos = p_pos;
		m_size = p_size;
		m_tileSheet = p_tileSheet;
		m_itemHeight = p_itemHeight;
		m_colorTheme = m_colorThemes[p_colorTheme];

		m_scroll = 0;
	}

	void addItem(ListItem p_item)
	{
		m_itemList.push_back(p_item);
		m_maxScroll = Sint16((m_itemList.size() - m_size.y + 1) * m_itemHeight);
	}
	void removeItem(Uint16 p_index)
	{
		m_itemList.erase(m_itemList.begin() + p_index);
		m_selectedItem--;
	}
	ListItem& getListItem(Uint16 p_index)
	{
		return m_itemList[p_index];
	}
	Uint16 getListSize()
	{
		return Uint16(m_itemList.size());
	}

	void input(Sint8& p_interactFlags, Sint8* p_keyStates, Sint8* p_mouseStates, Vector2<Sint32> p_mousePos)
	{
		p_mousePos = p_mousePos - m_pos;
		if(((p_interactFlags & 1) == 0) &&
			p_mousePos.x >= -4 && p_mousePos.x <= m_size.x + 4 &&
			p_mousePos.y >= -24 && p_mousePos.y <= m_size.y * m_itemHeight + 4)
			m_hover = true;
		else
			m_hover = false;
		
		m_update = 0;
		if(((p_interactFlags & 1) == 0) &&
			p_mousePos.x >= 0 && p_mousePos.x <= m_size.x &&
			p_mousePos.y >= 0 && p_mousePos.y <= m_size.y * m_itemHeight)
		{
			if(p_mouseStates[0] == 1)
			{
				if(Sint32((p_mousePos.y + (GLfloat(m_scroll) / m_itemHeight) * m_itemHeight) / m_itemHeight) <= Sint32(m_itemList.size()))
				{
					if(Uint16((p_mousePos.y + (GLfloat(m_scroll) / m_itemHeight) * m_itemHeight) / m_itemHeight) != m_selectedItem)
					{
						m_selectedItem = Uint16((p_mousePos.y + (GLfloat(m_scroll) / m_itemHeight) * m_itemHeight) / m_itemHeight);
						m_update = 1;
					}
				}
				if(Sint32((p_mousePos.y + (GLfloat(m_scroll) / m_itemHeight) * m_itemHeight) / m_itemHeight) == Sint32(m_itemList.size()))
				{
					addItem(ListItem(std::string("Item " + Util::numToString(m_itemList.size(), 0)), Uint16(m_itemList.size())));
					m_update = 3;
					if(Sint32(m_itemList.size()) >= m_size.y)
						m_scroll += m_itemHeight;
				}

				m_dragging = false;
				p_interactFlags += 1;
			}
			else if(p_mouseStates[1] == 1 || p_mouseStates[1] == 2 && m_dragging)
			{
				m_dragging = true;
				p_interactFlags += 1;
			}
		}

		if(m_dragging)
		{
			if(p_mouseStates[1] == 0 || p_mouseStates[0] == 1)
				m_dragging = false;
			else
			{
				m_scroll = m_scroll - (p_mousePos.y - m_mouseBuffer.y);
				if((p_interactFlags & 1) == 0)
					p_interactFlags += 1;
			}
		}

		if(m_hover)
			m_scroll = m_scroll - Globals::getInstance().m_mouseScroll * 4;

		if(m_scroll > m_maxScroll)
			m_scroll = m_maxScroll;
		if(m_scroll < 0)
			m_scroll = 0;

		m_mouseBuffer = p_mousePos;
	}
	void update(GLfloat p_deltaUpdate)
	{

	}
	void render()
	{
		glPushMatrix();
		{
			glTranslatef(GLfloat(m_pos.x), GLfloat(m_pos.y), 0);
			
			glPushMatrix();
			{
				m_colorTheme.m_back.useColor();
				glBegin(GL_QUADS);
				{
					glVertex2f(-5, GLfloat(m_size.y * m_itemHeight + 5));
					glVertex2f(GLfloat(m_size.x + 5), GLfloat(m_size.y * m_itemHeight + 5));
					glVertex2f(GLfloat(m_size.x + 5), -25);
					glVertex2f(-5, -25);
				}
				glEnd();

				m_colorTheme.m_fore.useColor();
				glBegin(GL_QUADS);
				{
					glVertex2f(-4, GLfloat(m_size.y * m_itemHeight + 4));
					glVertex2f(GLfloat(m_size.x + 4), GLfloat(m_size.y * m_itemHeight + 4));
					glVertex2f(GLfloat(m_size.x + 4), -24);
					glVertex2f(-4, -24);
				}
				glEnd();

				m_colorTheme.m_text.useColor();
				Font::getInstance().setFontSize(16);
				Font::getInstance().setAlignment(ALIGN_CENTER);
				Font::getInstance().print(m_title, m_size.x / 2, -20);

				glEnable(GL_SCISSOR_TEST);
				float mat[16];
				glGetFloatv(GL_MODELVIEW_MATRIX, mat);
				glScissor(GLint(mat[12] + Globals::getInstance().m_screenSize.x / 2), GLint(-mat[13] + Globals::getInstance().m_screenSize.y / 2 - m_size.y * m_itemHeight), 2000, m_size.y * m_itemHeight);

				glTranslatef(0, -GLfloat(m_scroll % m_itemHeight), 0);

				glBindTexture(GL_TEXTURE_2D, 0);

				glBegin(GL_QUADS);
				{
					for(Uint16 y = 0; y < Uint16(m_size.y) + 1; y++)
					{
						if(m_scroll / m_itemHeight + y == m_selectedItem)
						{
							m_colorTheme.m_active.useColor(1.2f);
						}
						else
						{
							if((y + (m_scroll / m_itemHeight)) % 2 == 0) m_colorTheme.m_active.useColor(1.1f);
							else m_colorTheme.m_active.useColor(1);
						}
						glVertex2f(0, GLfloat(y * m_itemHeight));
						glVertex2f(GLfloat(m_size.x), GLfloat(y * m_itemHeight));
						glVertex2f(GLfloat(m_size.x), GLfloat((y + 1) * m_itemHeight));
						glVertex2f(0, GLfloat((y + 1) * m_itemHeight));
					}
				}
				glEnd();

				if(m_tileSheet.getId() != -1)
				{
					glColor3f(1, 1, 1);
					glBindTexture(GL_TEXTURE_2D, m_tileSheet.getId());
					glBegin(GL_QUADS);
					{
						for(Uint16 i = 0; i < Uint16(m_size.y) + 1; i++)
						{
							if(i + round(m_scroll / m_itemHeight) < m_itemList.size())
							{
								Vector2<Sint32> _tileSizes = {m_tileSheet.getSize().x / m_itemHeight, m_tileSheet.getSize().y / m_itemHeight};
								glTexCoord2f(GLfloat(m_itemList[i + m_scroll / m_itemHeight].m_texId % _tileSizes.x) / _tileSizes.x,														1.f - (floor(GLfloat(m_itemList[i + m_scroll / m_itemHeight].m_texId) / _tileSizes.y) / _tileSizes.y));
								glVertex2f(0, GLfloat(i * m_itemHeight));
								glTexCoord2f(GLfloat(m_itemList[i + m_scroll / m_itemHeight].m_texId % _tileSizes.x) / _tileSizes.x + GLfloat(m_itemHeight) / m_tileSheet.getSize().x,	1.f - (floor(GLfloat(m_itemList[i + m_scroll / m_itemHeight].m_texId) / _tileSizes.y) / _tileSizes.y));
								glVertex2f(GLfloat(m_itemHeight), GLfloat(i * m_itemHeight));
								glTexCoord2f(GLfloat(m_itemList[i + m_scroll / m_itemHeight].m_texId % _tileSizes.x) / _tileSizes.x + GLfloat(m_itemHeight) / m_tileSheet.getSize().x,	1.f - (floor(GLfloat(m_itemList[i + m_scroll / m_itemHeight].m_texId) / _tileSizes.y) / _tileSizes.y + GLfloat(m_itemHeight) / m_tileSheet.getSize().y));
								glVertex2f(GLfloat(m_itemHeight), GLfloat((i + 1) * m_itemHeight));
								glTexCoord2f(GLfloat(m_itemList[i + m_scroll / m_itemHeight].m_texId % _tileSizes.x) / _tileSizes.x,														1.f - (floor(GLfloat(m_itemList[i + m_scroll / m_itemHeight].m_texId) / _tileSizes.y) / _tileSizes.y + GLfloat(m_itemHeight) / m_tileSheet.getSize().y));
								glVertex2f(0, GLfloat((i + 1) * m_itemHeight));
							}
						}
					}
					glEnd();
				}

				m_colorTheme.m_text.useColor();
				Font::getInstance().setAlignment(ALIGN_LEFT);
				Font::getInstance().setFontSize(16);
				for(Uint16 i = 0; i < Uint16(m_size.y) + 1; i++)
				{
					if(i + round(m_scroll / m_itemHeight) <= m_itemList.size())
					{
						if(i + round(m_scroll / m_itemHeight) == m_itemList.size())
							Font::getInstance().print("Add Item", 32, Sint32((i + 0.25f) * m_itemHeight));
						else
						{
							if(Sint32(m_itemList[i + m_scroll / m_itemHeight].m_name.length()) > m_size.x / 16 - 2)
								Font::getInstance().print(m_itemList[i + m_scroll / m_itemHeight].m_name.substr(0, m_size.x / 16 - 5) + "...", 32, Sint32((i + 0.25f) * m_itemHeight));
							else
								Font::getInstance().print(m_itemList[i + m_scroll / m_itemHeight].m_name, 32, Sint32((i + 0.25f) * m_itemHeight));
						}
					}
				}
			}
			glPopMatrix();

			if(m_selected)
				m_colorTheme.m_active.useColor();
			else
			{
				if(m_hover)
					Color((m_colorTheme.m_active + m_colorTheme.m_fore) / 2).useColor();
				else
					m_colorTheme.m_fore.useColor();
			}
			glBindTexture(GL_TEXTURE_2D, 0);
			if(m_maxScroll > 0)
			{
				GLfloat _mod = GLfloat(m_scroll) / m_maxScroll * (m_size.y * m_itemHeight - 64);
				glBegin(GL_QUADS);
				{
					glVertex2f(GLfloat(m_size.x - 12), GLfloat(_mod + 4));
					glVertex2f(GLfloat(m_size.x - 4), GLfloat(_mod + 4));
					glVertex2f(GLfloat(m_size.x - 4), GLfloat(_mod + 60));
					glVertex2f(GLfloat(m_size.x - 12), GLfloat(_mod + 60));
				}
				glEnd();
			}
			glDisable(GL_SCISSOR_TEST);
		}
		glPopMatrix();
	}

	Uint16 getSelectedItem()
	{
		return m_selectedItem;
	}
	Uint8 isUpdated()
	{
		return m_update;
	}

	Sint8 isSelected()
	{
		return m_selected;
	}

	void clear()
	{
		m_itemList.clear();
		m_selectedItem = 0;
	}
};
