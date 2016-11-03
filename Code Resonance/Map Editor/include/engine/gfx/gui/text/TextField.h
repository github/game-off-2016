#pragma once

#include "engine\utils\Globals.h"
#include "..\base\Component.h"
#include "..\..\font\Font.h"
#include <iostream>

struct TextField : public Component
{
private:
	std::string m_blankField;
	Uint16 m_fontSize;
	Uint16 m_maxChars;
	Vector2<Sint32> m_cursorPos;

	Vector2<Sint32> m_scroll;
	bool m_scrolling;
	std::vector<std::string> m_text;

	bool m_limited;
public:
	TextField(std::string p_compName, std::string p_title, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, Uint16 p_fontSize, Sint8 p_colorTheme = 0, bool p_limitField = true)
	{
		m_compName = p_compName;
		m_blankField = p_title;
		m_title = "";
		m_pos = p_pos;
		m_size = p_size * Sint32(p_fontSize);
		m_fontSize = p_fontSize;
		m_colorTheme = m_colorThemes[p_colorTheme];

		m_maxChars = p_size.x * p_size.y;

		m_scrolling = false;
		m_scroll = {};
		m_cursorPos = {};

		m_selected = 0;

		splitTitle();

		m_limited = p_limitField;
	}

	void setScroll(Vector2<Sint32> p_scroll)
	{
		m_scroll = p_scroll;
	}
	void setScrolling(bool p_state)
	{
		m_scrolling = p_state;
	}

	void setTitle(std::string p_title)
	{
		m_title = p_title;
		splitTitle();
		m_cursorPos = Vector2<Sint32>(Sint32(m_text[m_text.size() - 1].length()), Sint32(m_text.size() - 1));
	}

	void splitTitle()
	{
		m_text.clear();
		Sint32 _i = 0;
		for(Sint32 i = 0; i < Sint32(m_title.length()) - 1; i++)
		{
			if(m_title[i] == '\n')
			{
				m_text.push_back(m_title.substr(_i, i - _i));
				_i = i + 1;
			}
		}
		m_text.push_back(m_title.substr(_i, m_title.length() - _i));
	}

	void mergeTitle()
	{
		m_title = "";
		for(Uint16 i = 0; i < m_text.size(); i++)
		{
			m_title.append(m_text[i]);
			if(i < m_text.size() - 1)
				m_title += '\n';
		}
	}

	std::string getTitle()
	{
		mergeTitle();
		return m_title;
	}

	void input(Sint8& p_interactFlags, Sint8* p_keyStates, Sint8* p_mouseStates, Vector2<Sint32> p_mousePos)
	{
		p_mousePos = p_mousePos - m_pos;
		if(p_mouseStates[0] == 1)
		{
			if(p_mousePos.x >= 0 && p_mousePos.x < m_size.x
			&& p_mousePos.y >= 0 && p_mousePos.y < m_size.y)
				m_selected = 1;
			else
				m_selected = 0;
		}
		if(p_mouseStates[0] != 0)
		{
			if(p_mousePos.x >= 0 && p_mousePos.x < m_size.x
				&& p_mousePos.y >= 0 && p_mousePos.y < m_size.y)
			{
				m_cursorPos = p_mousePos / m_fontSize;
				if(m_cursorPos.y > Sint32(m_text.size()) - 1)
					m_cursorPos.y = Sint32(m_text.size()) - 1;
				if(m_cursorPos.x > Sint32(m_text[m_cursorPos.y].length()))
					m_cursorPos.x = Sint32(m_text[m_cursorPos.y].length());
			}
		}

		if(((p_interactFlags & 2) == 0) && m_selected)
		{
			p_interactFlags += 2;
			std::vector<Globals::keyPress> _keyEvents = Globals::getInstance().m_keyEvents;
			for(Uint16 i = 0; i < _keyEvents.size(); i++)
			{
				if(_keyEvents[i].m_action != 0)
				{
					if(_keyEvents[i].m_keyCode == GLFW_KEY_ESCAPE)
					{
						m_selected = 0;
					}
					else if(_keyEvents[i].m_keyCode == GLFW_KEY_BACKSPACE)
					{
						if(m_cursorPos.x > 0 || m_cursorPos.y > 0)
						{
							if(m_cursorPos.x == 0)
							{
								m_cursorPos.x = m_text[m_cursorPos.y - 1].length();
								m_text[m_cursorPos.y - 1] = m_text[m_cursorPos.y - 1] + m_text[m_cursorPos.y];
								m_text.erase(m_text.begin() + m_cursorPos.y);
								m_cursorPos.y -= 1;
							}
							else
							{
								m_cursorPos.x -= 1;
								m_text[m_cursorPos.y].erase(m_text[m_cursorPos.y].begin() + m_cursorPos.x);
							}
						}
					}
					else if(_keyEvents[i].m_keyCode == GLFW_KEY_DELETE)
					{
						if(m_cursorPos.x < Sint32(m_text[m_text.size() - 1].length()) || m_cursorPos.y < Sint32(m_text.size()) - 1)
						{
							if(m_cursorPos.x == m_text[m_cursorPos.y].length())
							{
								m_text[m_cursorPos.y] = m_text[m_cursorPos.y] + m_text[m_cursorPos.y + 1];
								m_text.erase(m_text.begin() + m_cursorPos.y + 1);
							}
							else
							{
								m_text[m_cursorPos.y].erase(m_text[m_cursorPos.y].begin() + m_cursorPos.x);
							}
						}
					}
					else if((m_cursorPos.x < (m_size.x / m_fontSize) && m_cursorPos.y < (m_size.y / m_fontSize)) || m_scrolling)
					{
						if(_keyEvents[i].m_keyCode >= 65 && _keyEvents[i].m_keyCode <= 90)
						{
							if((_keyEvents[i].m_mods & 1) == 0)
								m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, char(_keyEvents[i].m_keyCode + 32));
							else
								m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, char(_keyEvents[i].m_keyCode));
							m_cursorPos.x++;
						}
						else if(_keyEvents[i].m_keyCode == GLFW_KEY_SPACE)
						{
							m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, char(_keyEvents[i].m_keyCode));
							m_cursorPos.x++;
						}
						else if(_keyEvents[i].m_keyCode == GLFW_KEY_APOSTROPHE)
						{
							if((_keyEvents[i].m_mods & 1) == 0)
								m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, char(_keyEvents[i].m_keyCode));
							else
								m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, '\"');
							m_cursorPos.x++;
						}
						else if(_keyEvents[i].m_keyCode == GLFW_KEY_COMMA)
						{
							if((_keyEvents[i].m_mods & 1) == 0)
								m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, char(_keyEvents[i].m_keyCode));
							else
								m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, '<');
							m_cursorPos.x++;
						}
						else if(_keyEvents[i].m_keyCode == GLFW_KEY_PERIOD)
						{
							if((_keyEvents[i].m_mods & 1) == 0)
								m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, char(_keyEvents[i].m_keyCode));
							else
								m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, '>');
							m_cursorPos.x++;
						}
						else if(_keyEvents[i].m_keyCode == GLFW_KEY_SLASH)
						{
							if((_keyEvents[i].m_mods & 1) == 0)
								m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, char(_keyEvents[i].m_keyCode));
							else
								m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, '?');
							m_cursorPos.x++;
						}
						else if(_keyEvents[i].m_keyCode >= GLFW_KEY_0 && _keyEvents[i].m_keyCode <= GLFW_KEY_9)
						{
							if((_keyEvents[i].m_mods & 1) == 0)
							{
								m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, char(_keyEvents[i].m_keyCode));
							}
							else
							{
								switch(_keyEvents[i].m_keyCode)
								{
								case GLFW_KEY_1:
									m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, '!');
									break;
								case GLFW_KEY_2:
									m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, '@');
									break;
								case GLFW_KEY_3:
									m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, '#');
									break;
								case GLFW_KEY_4:
									m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, '$');
									break;
								case GLFW_KEY_5:
									m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, '%');
									break;
								case GLFW_KEY_6:
									m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, '^');
									break;
								case GLFW_KEY_7:
									m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, '&');
									break;
								case GLFW_KEY_8:
									m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, '*');
									break;
								case GLFW_KEY_9:
									m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, '(');
									break;
								case GLFW_KEY_0:
									m_text[m_cursorPos.y].insert(m_text[m_cursorPos.y].begin() + m_cursorPos.x, ')');
									break;
								default:
									break;
								}
							}
							m_cursorPos.x++;
						}
						else if(_keyEvents[i].m_keyCode == GLFW_KEY_ENTER)
						{
							if(m_cursorPos.y < (m_size.y / m_fontSize) - 1)
							{
								m_text.insert(m_text.begin() + m_cursorPos.y + 1, m_text[m_cursorPos.y].substr(m_cursorPos.x, m_text[m_cursorPos.y].length() - m_cursorPos.x));
								m_text[m_cursorPos.y].erase(m_cursorPos.x, m_text[m_cursorPos.y].length() - m_cursorPos.x);
								m_cursorPos.x = 0;
								m_cursorPos.y += 1;
							}
						}
						else// if(m_scrolling)
						{
							if(_keyEvents[i].m_keyCode == GLFW_KEY_UP)
							{
								if(m_cursorPos.y > 0)
								{
									m_cursorPos.y -= 1;
									if(m_cursorPos.x > Sint32(m_text[m_cursorPos.y].length()))
										m_cursorPos.x = Sint32(m_text[m_cursorPos.y].length());
								}
								else if(m_cursorPos.x > 0)
									m_cursorPos.x = 0;
							}
							if(_keyEvents[i].m_keyCode == GLFW_KEY_RIGHT)
							{
								if(m_cursorPos.x < Sint32(m_text[m_cursorPos.y].length()))
									m_cursorPos.x += 1;
								else if(m_cursorPos.y < Sint32(m_text.size()) - 1)
								{
									m_cursorPos.x = 0;
									m_cursorPos.y += 1;
									if(m_cursorPos.x > Sint32(m_text[m_cursorPos.y].length()))
										m_cursorPos.x = Sint32(m_text[m_cursorPos.y].length());
								}
							}
							if(_keyEvents[i].m_keyCode == GLFW_KEY_DOWN)
							{
								if(m_cursorPos.y < Sint32(m_text.size()) - 1)
								{
									m_cursorPos.y += 1;
									if(m_cursorPos.x > Sint32(m_text[m_cursorPos.y].length()))
										m_cursorPos.x = Sint32(m_text[m_cursorPos.y].length());
								}
								else if(m_cursorPos.x < Sint32(m_text[m_cursorPos.y].length()))
									m_cursorPos.x = Sint32(m_text[m_cursorPos.y].length());
							}
							if(_keyEvents[i].m_keyCode == GLFW_KEY_LEFT)
							{
								if(m_cursorPos.x > 0)
									m_cursorPos.x -= 1;
								else if(m_cursorPos.y > 0)
								{
									m_cursorPos.y -= 1;
									m_cursorPos.x = Sint32(m_text[m_cursorPos.y].length());
								}
							}
						}
						if(m_cursorPos.x == (m_size.x / m_fontSize) - 1 && m_cursorPos.y < (m_size.y / m_fontSize) - 1)
						{
							m_text.insert(m_text.begin() + m_cursorPos.y + 1, m_text[m_cursorPos.y].substr(m_cursorPos.x, m_text[m_cursorPos.y].length() - m_cursorPos.x));
							m_text[m_cursorPos.y].erase(m_cursorPos.x, m_text[m_cursorPos.y].length() - m_cursorPos.x);
							m_cursorPos.x = 0;
							m_cursorPos.y += 1;
						}
					}
				}
			}
		}

		if(((p_interactFlags & 1) == 0) &&
			p_mousePos.x >= 0 && p_mousePos.x < m_size.x
			&& p_mousePos.y >= 0 && p_mousePos.y < m_size.y)
			p_interactFlags += 1;
	}

	void update(GLfloat p_deltaUpdate)
	{

	}

	void render()
	{
		glPushMatrix();
		{
			glTranslatef(GLfloat(m_pos.x), GLfloat(m_pos.y), 0);
			glBegin(GL_QUADS);
			{
				m_colorTheme.m_back.useColor();
				glVertex2f(-1, -1);
				glVertex2f(GLfloat(m_size.x + 1), -1);
				glVertex2f(GLfloat(m_size.x + 1), GLfloat(m_size.y + 1));
				glVertex2f(-1, GLfloat(m_size.y + 1));
				
				if(m_selected) m_colorTheme.m_active.useColor();
				else m_colorTheme.m_fore.useColor();
				glVertex2f(0, 0);
				glVertex2f(GLfloat(m_size.x), 0);
				glVertex2f(GLfloat(m_size.x), GLfloat(m_size.y));
				glVertex2f(0, GLfloat(m_size.y));
			}
			glEnd();
			m_colorTheme.m_text.useColor();
			Font::getInstance().setAlignment(ALIGN_LEFT);
			Font::getInstance().setFontSize(m_fontSize);
			if(true || m_title.length() > 0)
			{
				for(Uint16 i = 0; i < m_text.size(); i++)
					Font::getInstance().print(m_text[i], 0, i * m_fontSize);
				if(m_selected != 0 && (fmod(glfwGetTime(), 0.5) < 0.25))
					Font::getInstance().print("|", m_cursorPos.x * m_fontSize - m_fontSize / 2 + 2, m_cursorPos.y * m_fontSize);
			}
			else
			{
				if(m_selected != 0)
				{
					m_colorTheme.m_text.useColor();
					Font::getInstance().print(((fmod(glfwGetTime(), 0.5) < 0.25) ? "|" : ""), 0, 0);
				}
				else
				{
					m_colorTheme.m_text.useColor(0.5f);
					for(Uint16 i = 0; i < fmin((m_size.y / m_fontSize), ceil(GLfloat(m_blankField.length()) / (m_size.x / m_fontSize))); i++)
						Font::getInstance().print(m_blankField.substr(i * (m_size.x / m_fontSize), (m_size.x / m_fontSize)) + ((m_selected && m_blankField.size() < m_maxChars && (i == (m_size.y / m_fontSize) - 1) && fmod(glfwGetTime(), 0.5) < 0.25) ? "|" : ""), 0, m_fontSize * i);
				}
			}
		}
		glPopMatrix();
	}
};
