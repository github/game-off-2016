#include "entity/weapons/gun.h"

Gun::Gun()
{
	m_angle = 0.f;
	m_texture.loadFromFile("res/Weapon/gun.png");

	m_bullets = new Projectile[MAX_BULLET_AMOUNT];

	for(int i = 0; i < MAX_BULLET_AMOUNT; i++)
	{
		m_bullets[i].loadTexture("res/Projectile/bullet.png");
		m_bullets[i].setCollisionBox(8, 8);
		m_bullets[i].setCenteredBox(false);
	}

	m_rateOfFire.start();
}

Gun::~Gun()
{
	delete m_bullets;
}

void Gun::action()
{
	for (int i = 0; i < MAX_BULLET_AMOUNT; i++)
		if (!m_bullets[i].isActive() && m_rateOfFire.getTicks() >= 200)
		{
			m_bullets[i].reload(m_position, m_weaponDirection, m_angle, 1000);
			m_bullets[i].setActive(true);
			m_rateOfFire.start();
		}
}

void Gun::render() const
{
	Vector2f _rotationPoint = { 0.f, 0.f };
	m_texture.render(m_position.x, m_position.y, NULL, NULL, NULL, m_angle, &_rotationPoint);
	for (int i = 0; i < MAX_BULLET_AMOUNT; i++)
		if (m_bullets[i].isActive())
			m_bullets[i].render();
}

void Gun::update(
	Vector2f& pos,
	float angle,
	float deltaTime)
{
	m_position = pos;
	this->m_angle = angle;

	m_position = updateRotation();

	m_collisionBox = { m_position, 32, 16 };

	for (int i = 0; i < MAX_BULLET_AMOUNT; i++)
	{
		if (m_bullets[i].isActive())
			m_bullets[i].update(deltaTime);
	}
}
