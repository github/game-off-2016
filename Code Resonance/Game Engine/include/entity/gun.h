#pragma once

#include "entity/weapon.h"
#include "entity/projectile.h"

class Gun : public Weapon
{
    public:
        Gun();
        ~Gun();

        void action();

        void render() const;
        void update(
			Vector2f& pos,
			float angle,
			float deltaTime);
    private:
		const int MAX_BULLET_AMOUNT = 3;
        Projectile* m_bullets;
};
