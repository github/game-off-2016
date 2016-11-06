#pragma once

#include "utils/general.h"
#include "utils/singleton.h"
#include "utils/timer.h"

#include "game/camera.h"
#include "game/map.h"

#include "physics/physics.h"
#include "physics/AABB.h"

#include "gfx/texture.h"

#include "entity/entity.h"
#include "entity/weapon.h"
#include "entity/gun.h"

class Player : public Singleton<Player>, public Entity
{
    public:
		Player();

        void render() const;
		void renderUI() const;
		void update(
			float deltaTime,
			Tile* tileTypes,
			int dimW,
			int dimH);
        void handleEvents();

		void setSpawnPosition(Vector2f pos) { m_position = pos; }

		void checkCollisionTypes(
			Tile* tileTypes,
			int dimW);

        void setPlayerHealth(int health) { m_health = health; }
        int getPlayerHealth() { return m_health; }

        //Weapon action on activation of space key.
        void action();
    private:
        Vector2f m_velocityGoal;
        int m_playerSpeed;
		int m_slipAmount;

        bool m_isCollided;

		//Attributes
		Texture m_healthBar;
		int m_health;

		Weapon* m_weapon;

		Projectile m_collisionCircle;
};

class Cursor : public Singleton<Cursor>, public Entity
{
    public:
        Cursor() { m_texture.loadFromFile("res/cursor.png") ;}

        void render() const;
        void update(float deltaTime);
};
