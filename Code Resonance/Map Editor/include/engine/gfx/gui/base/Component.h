#pragma once

#define COMPONENT_TEXTURE_STYLE_EMPTY -1
#define COMPONENT_TEXTURE_STYLE_NONE 0
#define COMPONENT_TEXTURE_STYLE_WRAP 1
#define COMPONENT_TEXTURE_STYLE_SCALE 2

#include "engine\utils\Utilities.h"

#include "..\..\LTexture.h"



class Component
{
protected:
	struct ColorTheme
	{
		Color m_back;
		Color m_fore;
		Color m_active;
		Color m_text;
		ColorTheme(Color p_back = {}, Color p_fore = {}, Color p_active = {}, Color p_text = {})
		{
			m_back = p_back;
			m_fore = p_fore;
			m_active = p_active;
			m_text = p_text;
		}
	};

	std::string m_compName, m_title;
	Vector2<Sint32> m_pos, m_size;
	Sint8 m_selected;
	ColorTheme m_colorTheme;

	Sint32 m_texture = -1;
	Sint8 m_textureStyle = COMPONENT_TEXTURE_STYLE_NONE;

	Sint16 m_borderThickness = 0;

	Sint32 m_numValue;

	// Default color themes
	std::vector< ColorTheme > m_colorThemes;
	bool m_visible = true;
	Sint8 m_moveToFront = 0;
	Sint8 m_priority = 0;
public:
	Component();
	Component(std::string p_compName, std::string p_title, Vector2<Sint32> p_pos, Vector2<Sint32> p_size, Sint8 p_colorTheme = 0);
	virtual Component* addComponent(Component* p_comp, Sint8 p_alignment = 0);
	virtual Component* findComponent(std::string p_compName);
	virtual std::string getItem(Uint16 p_index);
	virtual void addItem(std::string p_item);
	virtual void setSelectedItem(Uint16 p_selectedItem);
	virtual Uint8 isUpdated();
	virtual Uint16 getSelectedItem();
	std::string getName();
	virtual std::string getTitle();

	virtual void setTitle(std::string p_title);
	void setPosition(Vector2<Sint32> p_pos);
	void setSize(Vector2<Sint32> p_size);
	Vector2<Sint32> getPosition();
	Vector2<Sint32> getSize();

	virtual void setVisible(bool p_visible);
	bool isVisible();

	void setState(Sint8 p_selected);

	virtual void input(Sint8& p_interactFlags, Sint8* p_keyStates, Sint8* p_mouseStates, Vector2<Sint32> p_mousePos);
	virtual void update(GLfloat p_deltaUpdate);
	void renderBack();
	void renderFill(bool p_setColor = true);
	virtual void render();
	virtual Sint8 isSelected();
	void setValue(Sint16 p_value);
	Sint32& getValue();
	Sint8 getPriorityLayer();
	void setPriorityLayer(Sint8 p_priority);
};
