#pragma once

#include "utils/general.h"
#include "utils/timer.h"

#include "gfx/texture.h"

#include "utils/Vector2f.h"

#include "entity/entity.h"

class Weapon : public Entity
{
    public:
        virtual ~Weapon() {}

        virtual void render() const {}
		virtual void update(
			Vector2f& pos,
			float angle,
			float deltaTime) {}

        virtual void action() {}

        void setDirection(Vector2f& dir) { m_weaponDirection = dir; }
    protected:
		Vector2f updateRotation();

        Vector2f m_weaponDirection;

        Timer m_rateOfFire;
};