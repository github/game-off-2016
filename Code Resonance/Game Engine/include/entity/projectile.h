#pragma once

#include "utils/general.h"

#include "entity/entity.h"

class Projectile : public Entity
{
    public:
        Projectile();
        ~Projectile() = default;

		void reload(
			Vector2f pos,
			Vector2f vel,
			float a,
			float s);

		void render() const;
		void update(
			float deltaTime);

        void setProjectileSpeed(int speed) { m_projectileSpeed = speed; }

        void setActive(bool a) { m_active = a; }
        bool isActive() const { return m_active; }

        void setCircleType(
			GLubyte circleType);
		void loadTexture(
			char* filename);

		void setScale(GLfloat xscale, GLfloat yscale);
        void setCollisionBox(GLuint width, GLuint height);
		void setCenteredBox(bool centered) { m_centeredBox = centered;  }

		inline void setColor(SDL_Color color) { m_color = color; }

		AABB getCollisionBox() { return m_collisionBox; }
    private:
        int m_projectileSpeed;

        //whether projectile is on screen or not
        bool m_active;

        bool m_centeredBox;

        SDL_Color m_color;

        AABB m_collisionBox;
        GLuint m_baseWidth;
        GLuint m_baseHeight;
        GLfloat m_xScale;
        GLfloat m_yScale;
};
