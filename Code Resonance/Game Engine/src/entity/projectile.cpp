#include "entity/projectile.h"

Projectile::Projectile()
{
	m_texture.loadFromFile("res/Projectile/circleNormal.png", 64, 64, false);
	m_color = color(255, 255, 255, 255);
	m_position = Vector2f(0, 0);
	m_baseWidth = 32;
	m_baseHeight = 32;
	m_xScale = 1.f;
	m_yScale = 1.f;
	m_angle = 0.f;
	m_active = false;
	m_centeredBox = true;
}

void Projectile::loadTexture(char* filename)
{
	m_texture.loadFromFile(filename, 64, 64, false);
}

void Projectile::setCircleType(GLubyte circleType)
{
	/*
	0 = circleNormal
	1 = circleClean
	2 = circleShiny
	3 = circleGlow
	4 = circleFat
	*/
	switch (circleType)
	{
		case 0:
			m_texture.loadFromFile("res/Projectile/circleNormal.png", 64, 64, false);
		break;
		case 1:
			m_texture.loadFromFile("res/Projectile/circleClean.png", 64, 64, false);
		break;
		case 2:
			m_texture.loadFromFile("res/Projectile/circleShiny.png", 64, 64, false);
		break;
		case 3:
			m_texture.loadFromFile("res/Projectile/circleGlow.png", 64, 64, false);
		break;
		case 4:
			m_texture.loadFromFile("res/Projectile/circleFat.png", 64, 64, false);
		break;
	}
}

void Projectile::update(float deltaTime)
{
	m_position = m_position + (m_velocity * deltaTime);
	if (m_position.x - Camera::getInstance().m_collisionBox.position.x < 0 || m_position.x
	- Camera::getInstance().m_collisionBox.position.x > SCREEN_WIDTH)
		setActive(false);
	if (m_position.y - Camera::getInstance().m_collisionBox.position.y < 0 || m_position.y
	- Camera::getInstance().m_collisionBox.position.y > SCREEN_HEIGHT)
		setActive(false);

	if(m_centeredBox)
	{
		Vector2f _center = { m_position.x + ((m_baseWidth * m_xScale) / 2), m_position.y + ((m_baseHeight * m_yScale) / 2)};
		m_collisionBox = { _center, m_baseWidth * (GLuint)m_xScale, m_baseHeight * (GLuint)m_yScale };
	}
	else
		m_collisionBox = { m_position, m_baseWidth * (GLuint)m_xScale, m_baseHeight * (GLuint)m_yScale };
}

void Projectile::render() const
{
	Vector2f _rotationPoint = { m_texture.getWidth() / 2.f, m_texture.getHeight() / 2.f };

	m_texture.render(m_position.x, m_position.y, NULL, m_texture.getWidth() * m_xScale, m_texture.getHeight() * m_yScale, m_angle, &_rotationPoint, m_color);

	Rectf box = { m_collisionBox.position.x, m_collisionBox.position.y, m_baseWidth * m_xScale, m_baseHeight * m_yScale };
	if (g_showCollisionBox) renderEmptyBox(box, m_color);
}

void Projectile::reload(
	Vector2f pos,
	Vector2f vel,
	float a,
	float s)
{
	m_position = pos;
	m_velocity = vel * s;
	m_projectileSpeed = (int)s;
	m_angle = a;
	m_active = false;
}

void Projectile::setScale(GLfloat xscale, GLfloat yscale)
{
	m_xScale = xscale;
	m_yScale = yscale;
}

void Projectile::setCollisionBox(GLuint width, GLuint height)
{
	m_baseWidth = width;
	m_baseHeight = height;
}
