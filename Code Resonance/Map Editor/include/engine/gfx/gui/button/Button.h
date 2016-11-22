#pragma once

#include "engine\utils\Utilities.h"
#include "..\base\Component.h"
#include "..\..\font\Font.h"

class CButton : public Component
{
private:

	Sint32 m_fontSize;

	Texture m_buttonTex;

	bool m_hover;
	bool m_stuck;

	typedef void (*function)();
	function m_function;
public:
	CButton(std::string p_compName, std::string p_title, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, Sint32 p_fontSize, Sint8 p_colorTheme, function p_function = 0)
	{
		m_selected = 0;
		m_compName = p_compName;
		m_title = p_title;
		m_pos = p_pos;
		m_size = p_size;
		m_fontSize = p_fontSize;
		m_colorTheme = m_colorThemes[p_colorTheme];

		m_texture = LTexture::getInstance().loadImage("gui\\BarRect.png");
		m_textureStyle = COMPONENT_TEXTURE_STYLE_SCALE;

		m_function = p_function;
	}
	CButton(std::string p_compName, std::string p_title, Texture p_buttonTex, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, Sint32 p_fontSize, Sint8 p_colorTheme, function p_function = 0)
	{
		m_selected = 0;
		m_compName = p_compName;
		m_title = p_title;
		m_buttonTex = p_buttonTex;
		m_pos = p_pos;
		m_size = p_size;
		m_fontSize = p_fontSize;
		m_colorTheme = m_colorThemes[p_colorTheme];

		m_texture = LTexture::getInstance().loadImage("gui\\BarRect.png");
		m_textureStyle = COMPONENT_TEXTURE_STYLE_SCALE;

		m_function = p_function;
	}
	void input(Sint8& p_interactFlags, Sint8* p_keyStates, Sint8* p_mouseStates, Vector2<Sint32> p_mousePos)
	{
		if(((p_interactFlags & 1) == 0 || m_hover) &&
			p_mousePos.x >= m_pos.x && p_mousePos.x <= m_pos.x + m_size.x &&
			p_mousePos.y >= m_pos.y && p_mousePos.y <= m_pos.y + m_size.y)
		{
			m_hover = true;
			if((p_interactFlags & 1) == 0)
				p_interactFlags += 1;
		}
		else
			m_hover = false;
		
		if(m_hover)
		{
			if(p_mouseStates[0] != 0)
			{
				if(p_mouseStates[0] == 1 || m_selected != 0)
				{
					if(m_selected == 0) m_selected = 1;
					else m_selected = 2;
					return;
				}
			}
			else
			{
				if(m_selected == 1 || m_selected == 2)
				{
					m_selected = 3;
					return;
				}
				else if(m_selected == 3)
				{
					m_selected = 0;
					if(m_function)
						m_function();
					return;
				}
			}
		}
		m_selected = 0;
	}
	void update(GLfloat p_deltaUpdate)
	{
		if(m_stuck)
		{
			m_selected = 0;
			m_stuck = false;
		}
		else if(m_selected == 3)
			m_stuck = true;
		else
			m_stuck = false;
	}
	void render()
	{
		if(m_selected)
			m_colorTheme.m_active.useColor();
		else
		{
			if(m_hover)
				Color((m_colorTheme.m_active / 2 + m_colorTheme.m_fore / 2)).useColor();
			else
				m_colorTheme.m_fore.useColor();
		}
		Component::renderFill(false);

		glPushMatrix();
		{
			glTranslatef(GLfloat(m_pos.x), GLfloat(m_pos.y), 0);
			glTranslatef(GLfloat(m_size.x / 2), GLfloat(m_size.y / 2), 0);
			
			if(m_buttonTex.getId() != 0)
			{
				glPushMatrix();
				{
					glColor3f(1, 1, 1);
					glBindTexture(GL_TEXTURE_2D, m_buttonTex.getId());
					glBegin(GL_QUADS);
					{
						glTexCoord2f(0, 1);
						glVertex2f(-GLfloat(m_buttonTex.getSize().x) / 2, -GLfloat(m_buttonTex.getSize().y) / 2);
						glTexCoord2f(1, 1);
						glVertex2f(GLfloat(m_buttonTex.getSize().x) / 2, -GLfloat(m_buttonTex.getSize().y) / 2);
						glTexCoord2f(1, 0);
						glVertex2f(GLfloat(m_buttonTex.getSize().x) / 2, GLfloat(m_buttonTex.getSize().y) / 2);
						glTexCoord2f(0, 0);
						glVertex2f(-GLfloat(m_buttonTex.getSize().x) / 2, GLfloat(m_buttonTex.getSize().y) / 2);
					}
					glEnd();
				}
				glPopMatrix();
			}
			

			m_colorTheme.m_text.useColor();
			Font::getInstance().setFontSize(m_fontSize);
			Font::getInstance().setAlignment(ALIGN_CENTER);
			Font::getInstance().print(m_title, 0, -8);
		}
		glPopMatrix();
	}

	Sint8 isSelected() // 0 = not selected, 1 = JUST pressed, 2 = is held, 3 = JUST released
	{
		if(!m_visible) return 0;
		return m_selected;
	}
};

class CButtonToggle : public Component
{
private:
	Sint32 m_fontSize;
	Texture m_buttonTex[2];
	Sint8 m_texType;

	bool m_hover;
public:
	CButtonToggle(std::string p_compName, std::string p_title, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, Sint32 p_fontSize, Sint8 p_colorTheme, Sint8 p_state = 0)
	{
		m_compName = p_compName;
		m_title = p_title;
		m_pos = p_pos;
		m_size = p_size;
		m_fontSize = p_fontSize;
		m_colorTheme = m_colorThemes[p_colorTheme];
		m_selected = p_state;

		m_borderThickness = 1;
		m_texType = 0;
	}
	CButtonToggle(std::string p_compName, std::string p_title, Texture p_buttonTex, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, Sint32 p_fontSize, Sint8 p_colorTheme, Sint8 p_state = 0)
	{
		m_compName = p_compName;
		m_title = p_title;
		m_buttonTex[0] = p_buttonTex;
		m_pos = p_pos;
		m_size = p_size;
		m_colorTheme = m_colorThemes[p_colorTheme];
		m_selected = p_state;

		m_borderThickness = 1;
		m_texType = 1;
	}
	CButtonToggle(std::string p_compName, std::string p_title, Texture p_activeTex, Texture p_inactiveTex, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, Sint32 p_fontSize, Sint8 p_colorTheme, Sint8 p_state = 0)
	{
		m_compName = p_compName;
		m_title = p_title;
		m_buttonTex[0] = p_activeTex;
		m_buttonTex[1] = p_inactiveTex;
		m_pos = p_pos;
		m_size = p_size;
		m_colorTheme = m_colorThemes[p_colorTheme];
		m_selected = p_state;

		m_borderThickness = 1;
		m_texType = 2;
	}

	void input(Sint8& p_interactFlags, Sint8* p_keyStates, Sint8* p_mouseStates, Vector2<Sint32> p_mousePos)
	{
		m_numValue = 0;
		if((p_interactFlags & 1) == 0 &&
			p_mousePos.x >= m_pos.x && p_mousePos.x <= m_pos.x + m_size.x &&
			p_mousePos.y >= m_pos.y && p_mousePos.y <= m_pos.y + m_size.y)
		{
			m_hover = true;
			if(p_mouseStates[0] == 1)
			{
				m_numValue = 1;
				m_selected = !m_selected;
				p_interactFlags += 1;
			}
		}
		else
			m_hover = false;
	}

	void update(GLfloat p_deltaUpdate)
	{

	}

	void render()
	{
		Component::render();
		glPushMatrix();
		{
			glTranslatef(GLfloat(m_pos.x), GLfloat(m_pos.y), 0);
			if(m_selected)
				m_colorTheme.m_active.useColor();
			else
			{
				if(m_hover)
					((m_colorTheme.m_active / 2 + m_colorTheme.m_fore / 2)).useColor();
				else
					m_colorTheme.m_fore.useColor();
			}
			glBegin(GL_QUADS);
			{
				glVertex2f(0, 0);
				glVertex2f(GLfloat(m_size.x), 0);
				glVertex2f(GLfloat(m_size.x), GLfloat(m_size.y));
				glVertex2f(0, GLfloat(m_size.y));
			}
			glEnd();

			glTranslatef(GLfloat(m_size.x / 2), GLfloat(m_size.y / 2), 0);
			if(m_texType != 0)
			{
					glColor3f(1, 1, 1);
					if(m_selected != 0 || m_texType == 1)
						glBindTexture(GL_TEXTURE_2D, m_buttonTex[0].getId());
					else
						glBindTexture(GL_TEXTURE_2D, m_buttonTex[1].getId());
					glBegin(GL_QUADS);
					{
						glTexCoord2f(0, 1);
						if(m_selected != 0 || m_texType == 1) glVertex2f(-GLfloat(m_buttonTex[0].getSize().x) / 2, -GLfloat(m_buttonTex[0].getSize().y) / 2);
						else glVertex2f(-GLfloat(m_buttonTex[1].getSize().x) / 2, -GLfloat(m_buttonTex[1].getSize().y) / 2);
						glTexCoord2f(1, 1);
						if(m_selected != 0 || m_texType == 1) glVertex2f(GLfloat(m_buttonTex[0].getSize().x) / 2, -GLfloat(m_buttonTex[0].getSize().y) / 2);
						else glVertex2f(GLfloat(m_buttonTex[1].getSize().x) / 2, -GLfloat(m_buttonTex[1].getSize().y) / 2);
						glTexCoord2f(1, 0);
						if(m_selected != 0 || m_texType == 1) glVertex2f(GLfloat(m_buttonTex[0].getSize().x) / 2, GLfloat(m_buttonTex[0].getSize().y) / 2);
						else glVertex2f(GLfloat(m_buttonTex[1].getSize().x) / 2, GLfloat(m_buttonTex[1].getSize().y) / 2);
						glTexCoord2f(0, 0);
						if(m_selected != 0 || m_texType == 1) glVertex2f(-GLfloat(m_buttonTex[0].getSize().x) / 2, GLfloat(m_buttonTex[0].getSize().y) / 2);
						else glVertex2f(-GLfloat(m_buttonTex[1].getSize().x) / 2, GLfloat(m_buttonTex[1].getSize().y) / 2);
					}
					glEnd();
			}

			m_colorTheme.m_text.useColor();
			Font::getInstance().setFontSize(m_fontSize);
			Font::getInstance().setAlignment(ALIGN_CENTER);
			Font::getInstance().print(m_title, 0, -8);
		}
		glPopMatrix();
	}
};


class CButtonRadio : public Component
{
private:
	Uint16 m_selectedButton, m_prevSelectedButton;

	std::vector<CButtonToggle*> m_buttonList;
public:
	CButtonRadio(std::string p_compName, std::string p_title, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, Sint8 p_colorTheme)
	{
		m_compName = p_compName;
		m_title = p_title;
		m_pos = p_pos;
		m_size = p_size;
		m_colorTheme = m_colorThemes[p_colorTheme];

		m_borderThickness = 1;
		m_selectedButton = 0;
	}

	void addButton(CButtonToggle* p_button)
	{
		m_buttonList.push_back(p_button);
		m_buttonList[m_selectedButton]->setState(1);
	}

	void input(Sint8& p_interactFlags, Sint8* p_keyStates, Sint8* p_mouseStates, Vector2<Sint32> p_mousePos)
	{
		m_prevSelectedButton = m_selectedButton;
		p_mousePos = p_mousePos - m_pos;
		if((p_interactFlags & 1) == 0)
		{
			for(Uint16 i = 0; i < m_buttonList.size(); i++)
			{
				m_buttonList[i]->input(p_interactFlags, p_keyStates, p_mouseStates, p_mousePos);
				if(m_buttonList[i]->getValue() != 0)
				{
					if(i != m_selectedButton)
					{
						m_buttonList[m_selectedButton]->setState(0);
						m_selectedButton = i;
					}
					m_buttonList[m_selectedButton]->setState(1);
					if((p_interactFlags & 1) == 0)
						p_interactFlags += 1;
					return;
				}
			}
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
			for(Uint16 i = 0; i < m_buttonList.size(); i++)
				m_buttonList[i]->render();
		}
		glPopMatrix();
	}

	void setSelectedButton(Uint16 p_selectedButton)
	{
		m_prevSelectedButton = m_selectedButton;
		m_selectedButton = p_selectedButton;
	}
	Uint16 getSelectedButton()
	{
		return m_selectedButton;
	}
	Uint16 getPrevSelectedButton()
	{
		return m_prevSelectedButton;
	}
};
