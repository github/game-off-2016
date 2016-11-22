#include "entity/weapon.h"

Vector2f Weapon::updateRotation()
{
	//To store the new x amd y values
	Vector2f _tempPosition;

	//origin, center of player texture
	auto _cx = m_position.x + 36.f;
	auto _cy = m_position.y + 36.f;

	//Position of left hand
	m_position.x += 64;
	m_position.y += 0;

	m_position.x -= _cx;
	m_position.y -= _cy;

	//Calcluate coordinates after rotation
	_tempPosition.x = (float)(m_position.x * cos(m_angle * PI / 180) -
		m_position.y * sin(m_angle * PI / 180));
	_tempPosition.y = (float)(m_position.x * sin(m_angle * PI / 180) +
		m_position.y * cos(m_angle * PI / 180));

	m_position.x = _tempPosition.x + _cx;
	m_position.y = _tempPosition.y + _cy;

	return m_position;
}
