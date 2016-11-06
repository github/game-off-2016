#pragma once

#include "physics/physics.h"

#include "utils/general.h"
#include "utils/vector2f.h"

class AABB
{
    public:
        AABB() {}

		AABB(Vector2f& pos, GLuint w, GLuint h)
        {
            position = pos;
            width = w;
            height = h;
        }

        Vector2f position;
		GLuint width, height;
};

inline bool Collision(AABB& a, AABB& b)
{
    return (a.position.x < b.position.x + b.width &&
        a.position.x + a.width > b.position.x &&
        a.position.y < b.position.y + b.height &&
        a.height + a.position.y > b.position.y);
};
