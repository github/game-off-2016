#pragma once

#include <string>

#include "physics/AABB.h"

#include "gfx/texture.h"

#include "sfx/music.h"

#include "entity/player.h"

#include "utils/general.h"
#include "utils/vector2f.h"

class Button
{
	public:
		Button() {};
		Button(
			Vector2f pos,
			GLuint w,
			GLuint h,
			char* msg);
		~Button();

		void render() const;
		void handleEvents();

		bool getClicked() { return m_click; }
	private:
		AABB m_collisionBox;

		Texture m_buttonTex;
		Texture m_messageTex;

		bool m_hover;
		bool m_click;

		Sfx m_menuHover;
		Sfx m_menuClick;
};

void addButton(
	std::vector<Button*> &buttons,
	char* message, 
	Vector2f pos, 
	GLuint w,
	GLuint h);