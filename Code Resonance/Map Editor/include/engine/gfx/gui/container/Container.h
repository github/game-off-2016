#pragma once

#define PANEL_ALIGN_NONE				0
#define PANEL_ALIGN_CENTER				1
#define PANEL_ALIGN_LEFT				2
#define PANEL_ALIGN_RIGHT				3
#define PANEL_ALIGN_TOP					4
#define PANEL_ALIGN_BOTTOM				5
#define PANEL_ALIGN_TOP_LEFT			6
#define PANEL_ALIGN_TOP_RIGHT			7
#define PANEL_ALIGN_BOTTOM_LEFT			8
#define PANEL_ALIGN_BOTTOM_RIGHT		9

#include "..\base\Component.h"
#include "..\..\font\Font.h"

#include "engine\utils\Globals.h"
#include <algorithm>


class Container : public Component
{
private:
	std::vector<Component*> m_componentList;
public:
	Container() {};
	Container(std::string p_compName, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, bool p_visible)
	{
		m_compName = p_compName;
		m_pos = p_pos;
		m_size = p_size;
		m_visible = p_visible;
	}

	virtual Component* addComponent(Component* p_component, Sint8 p_alignment = PANEL_ALIGN_NONE)
	{
		switch(p_alignment)
		{
		case PANEL_ALIGN_NONE:
			p_component->setPosition(p_component->getPosition());
			break;
		case PANEL_ALIGN_CENTER:
			p_component->setPosition(p_component->getPosition() + Vector2<Sint32>(Sint32(m_size.x - p_component->getSize().x) / 2, Sint32(m_size.y - p_component->getSize().y) / 2));
			break;
		case PANEL_ALIGN_LEFT:
			p_component->setPosition(p_component->getPosition() + Vector2<Sint32>(0, Sint32(m_size.y - p_component->getSize().y) / 2));
			break;
		case PANEL_ALIGN_RIGHT:
			p_component->setPosition(p_component->getPosition() + Vector2<Sint32>(Sint32(m_size.x - p_component->getSize().x), Sint32(m_size.y - p_component->getSize().y) / 2) + Vector2<Sint32>(Sint32(p_component->getPosition().x * -2), 0));
			break;
		case PANEL_ALIGN_TOP:
			p_component->setPosition(p_component->getPosition() + Vector2<Sint32>(Sint32(m_size.x - p_component->getSize().x) / 2, 0));
			break;
		case PANEL_ALIGN_BOTTOM:
			p_component->setPosition(p_component->getPosition() + Vector2<Sint32>(Sint32(m_size.x - p_component->getSize().x) / 2, Sint32(m_size.y - p_component->getSize().y)) + Vector2<Sint32>(0, Sint32(p_component->getPosition().y * -2)));
			break;
		case PANEL_ALIGN_TOP_LEFT:
			p_component->setPosition(p_component->getPosition());
			break;
		case PANEL_ALIGN_TOP_RIGHT:
			p_component->setPosition(p_component->getPosition() + Vector2<Sint32>(Sint32(m_size.x - p_component->getSize().x), 0) + Vector2<Sint32>(Sint32(p_component->getPosition().x * -2), 0));
			break;
		case PANEL_ALIGN_BOTTOM_LEFT:
			p_component->setPosition(p_component->getPosition() + Vector2<Sint32>(0, Sint32(m_size.y - p_component->getSize().y)) + Vector2<Sint32>(0, Sint32(p_component->getPosition().y * -2)));
			break;
		case PANEL_ALIGN_BOTTOM_RIGHT:
			p_component->setPosition(p_component->getPosition() + Vector2<Sint32>(Sint32(m_size.x - p_component->getSize().x), Sint32(m_size.y - p_component->getSize().y)) + Vector2<Sint32>(Sint32(p_component->getPosition().x * -2), Sint32(p_component->getPosition().y * -2)));
			break;
		}
		m_componentList.push_back({p_component});
		return p_component;
	}
	Component* findComponent(std::string p_compName)
	{
		for(Uint16 i = 0; i < m_componentList.size(); i++)
			if(m_componentList[i]->getName() == p_compName)
				return m_componentList[i];
		return 0;
	}

	void setVisible(bool p_visible)
	{
		m_visible = p_visible;
		if(p_visible == false)
			for(Uint16 i = 0; i < m_componentList.size(); i++)
				m_componentList[i]->update(0);
	}

	void input(Sint8& p_interactFlags, Sint8* p_keyStates, Sint8* p_mouseStates, Vector2<Sint32> p_mousePos)
	{
		Vector2<Sint32> _mousePos;
		if(m_visible)
		{
			for(Sint32 i = m_componentList.size() - 1; i >= 0; i--)
			{
				if(!m_componentList[i]->isVisible())
					continue;
				_mousePos = p_mousePos - m_pos;
				m_componentList[i]->input(p_interactFlags, p_keyStates, p_mouseStates, _mousePos);
			}
		}
	}
	void update(GLfloat p_updateTime)
	{
		if(m_visible)
			for(Uint16 i = 0; i < m_componentList.size(); i++)
				if(m_componentList[i]->isVisible())
				{
					if(m_componentList[i]->getPriorityLayer())
					{
						m_componentList.push_back(m_componentList[i]);
						m_componentList.erase(m_componentList.begin() + i);
					}
					m_componentList[i]->update(p_updateTime);
				}

		struct
		{
			bool operator()(Component* a, Component* b)
			{
				return (a->getPriorityLayer() < b->getPriorityLayer());
			}
		} sortPriority;
		std::sort(m_componentList.begin(), m_componentList.end(), sortPriority);
	}
	void render()
	{
		if(m_visible)
		{
			glPushMatrix();
			{
				glTranslatef(GLfloat(m_pos.x), GLfloat(m_pos.y), 0);
				for(Uint16 i = 0; i < m_componentList.size(); i++)
				{
					if(m_componentList[i]->isVisible())
					{
						glPushMatrix();
						{
							m_componentList[i]->render();
						}
						glPopMatrix();
					}
				}
			}
			glPopMatrix();
		}
	}
};
