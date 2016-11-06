#pragma once

#include "entity/entity.h"

#include "gfx/texture.h"

#include "utils/vector2f.h"
#include "utils/timer.h"

class Enemy : public Entity
{
    public:
		Enemy() {};
		~Enemy() {};

		virtual void render() {}
		virtual void update(
			float deltaTime) {}
    protected:
		Timer m_animationTimer;
};
