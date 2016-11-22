#pragma once

#include "..\button\Button.h"
#include "..\base\Component.h"

struct CCounter : public Component
{
private:
	CButton* m_buttonAdd, *m_buttonSubtract;
public:
	CCounter(std::string p_compName, std::string p_title, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, Sint8 p_colorTheme, Sint16 p_currValue)
	{
		m_compName = p_compName;
		m_title = p_title;
		m_pos = p_pos;
		m_size = p_size;
		m_colorTheme = m_colorThemes[p_colorTheme];
		m_numValue = p_currValue;

		m_buttonAdd = new CButton("", "+", Vector2<Sint32>(p_pos.x + m_title.length() * 16 + 20, p_pos.y), Vector2<Sint32>(16, 16), 16, 1);
		m_buttonSubtract = new CButton("", "-", Vector2<Sint32>(p_pos.x + m_title.length() * 16, p_pos.y), Vector2<Sint32>(16, 16), 16, 1);
	}
	~CCounter()
	{
		delete m_buttonSubtract;
		delete m_buttonAdd;
		Component::~Component();
	}

	void input(Sint8& p_interactFlags, Sint8* p_keyStates, Sint8* p_mouseStates, Vector2<Sint32> p_mousePos)
	{
		m_buttonAdd->input(p_interactFlags, p_keyStates, p_mouseStates, p_mousePos);
		m_buttonSubtract->input(p_interactFlags, p_keyStates, p_mouseStates, p_mousePos);
		if(p_keyStates[GLFW_KEY_LEFT_SHIFT] || p_keyStates[GLFW_KEY_RIGHT_SHIFT])
		{
			if(m_buttonAdd->isSelected() != 0)
				m_numValue++;
			if(m_buttonSubtract->isSelected() != 0)
				m_numValue--;
		}
		else if(p_keyStates[GLFW_KEY_LEFT_CONTROL] || p_keyStates[GLFW_KEY_RIGHT_CONTROL])
		{
			if(m_buttonAdd->isSelected() != 0)
				m_numValue+=5;
			if(m_buttonSubtract->isSelected() != 0)
				m_numValue-=5;
		}
		else
		{
			if(m_buttonAdd->isSelected() == 1)
				m_numValue++;
			if(m_buttonSubtract->isSelected() == 1)
				m_numValue--;
		}

		if(m_numValue < m_size.x)
			m_numValue = m_size.x;
		if(m_numValue > m_size.y)
			m_numValue = m_size.y;
	}
	void update(GLfloat p_deltaUpdate)
	{
		
	}

	void render()
	{
		glColor3f(1, 1, 1);
		Font::getInstance().setFontSize(16);
		Font::getInstance().setAlignment(ALIGN_LEFT);
		Font::getInstance().print(m_title, m_pos.x, m_pos.y);
		Font::getInstance().print(Util::numToString(m_numValue, 0), m_pos.x + m_title.length() * 16 + 48, m_pos.y);

		m_buttonSubtract->render();
		m_buttonAdd->render();
	}

	void setPos(Vector2<Sint32> p_pos)
	{
		m_pos = p_pos;
	}
	Vector2<Sint32> getPos()
	{
		return m_pos;
	}
};
