#pragma once

#include "utils/Vector2f.h"

#include "physics/AABB.h"

#include "gfx/texture.h"
#include "gfx/spritesheet.h"

class Entity
{
    public:
        void render() {};
        void update() {};
        void handleEvents() {};

        Vector2f& getPosition() { return m_position; }
		inline void setPosition(Vector2f pos) { m_position = pos; }

        AABB& getCollisionBox() { return m_collisionBox; }
    protected:
        Vector2f m_position;
        Vector2f m_velocity;
        Vector2f m_direction;

        float m_angle;

        AABB m_collisionBox;

        Texture m_texture;
		SpriteSheet m_spriteSheet;
};
