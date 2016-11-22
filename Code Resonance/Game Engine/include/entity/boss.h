#pragma once

#include "entity/projectile.h"

#include "utils/Vector2f.h"

#include "physics/AABB.h"

#include "gfx/texture.h"
#include "gfx/spritesheet.h"

class Boss
{
	public:
		virtual void render() {};
		virtual void update(float deltaTime) {};
		virtual void handleEvents() {};

		//This is more of an outline
		void phaseOne() {};
		void phaseTwo() {};
		void phaseThree() {};

		Vector2f& getPosition() { return m_position; }

		AABB& getCollisionBox() { return m_collisionBox; }

		Projectile* getProjectiles() { return m_Projectiles; }
	protected:
		Vector2f m_position;
		Vector2f m_velocity;
		Vector2f m_direction;

		float m_angle;

		float m_health;

		AABB m_collisionBox;

		Texture m_texture;
		SpriteSheet m_spriteSheet;

		uint8_t m_phaseNumber;

		Projectile* m_Projectiles;
};
