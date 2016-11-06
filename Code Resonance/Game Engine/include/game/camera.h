#pragma once

#include "utils/general.h"
#include <iostream>

#include "utils/general.h"
#include "utils/singleton.h"
#include "utils/Vector2f.h"

#include "physics/AABB.h"

class Camera : public Singleton<Camera>
{
    public:
		Camera() { m_collisionBox = { Vector2f(0, 0), SCREEN_WIDTH, SCREEN_HEIGHT }; }

		void update()
		{
			glMatrixMode(GL_MODELVIEW);
			glPopMatrix();
				glLoadIdentity();

				glTranslatef(-m_collisionBox.position.x, -m_collisionBox.position.y, 0.f);

			glPushMatrix();
		}

		void setCoords(Vector2f pos) { m_collisionBox.position = pos; }
		void addCoords(Vector2f pos) { m_collisionBox.position = m_collisionBox.position + pos; }

		AABB m_collisionBox;
};
