#include "entity/player.h"

void Cursor::render() const
{
	Vector2f rotationPoint = { m_texture.getWidth() / 2.f, m_texture.getHeight() / 2.f };
	m_texture.render(m_position.x - m_texture.getWidth() / 2.f, m_position.y - m_texture.getHeight() / 2.f,
	 NULL, NULL, NULL, m_angle, &rotationPoint);
}

void Cursor::update(
	float deltaTime)
{
    int x, y;
    SDL_GetMouseState(&x, &y);

	m_position.x = (GLfloat)x + Camera::getInstance().m_collisionBox.position.x;
	m_position.y = (GLfloat)y + Camera::getInstance().m_collisionBox.position.y;
	m_angle += 100 * deltaTime;
	m_collisionBox = {Vector2f(m_position.x, m_position.y), 1, 1};
}

Player::Player()
{
	m_angle = 0.f;
	m_position = {0, 0};

	m_playerSpeed = 4; //Will become 4 * 100 = 400 afted deltatime inclusion
	m_slipAmount = 15; //Defaul`t

	m_texture.loadFromFile("res/player.png", 32, 32);

	m_healthBar.loadFromFile("res/GUI/staminaBar.png", 255, 32);
	m_health = 3;

	m_weapon = new Gun();

	m_collisionCircle.setCircleType(0);
	m_collisionCircle.setColor(color(255, 32, 32, 64));
	m_collisionCircle.setActive(true);
}

void Player::render() const
{
	Vector2f _rotationPoint = { m_texture.getWidth() / 2.f, m_texture.getHeight() / 2.f };
	m_texture.render(m_position.x, m_position.y, NULL, NULL, NULL, m_angle, &_rotationPoint);
	Rectf _box = { m_collisionBox.position.x, m_collisionBox.position.y, 32, 32 };
	if (g_showCollisionBox) renderEmptyBox(_box, color(0, 255, 0, 255));
	m_weapon->render();
	m_collisionCircle.render();
}

void Player::renderUI() const
{
	Rectf _healthBarClip = { 0.f, 0.f, (m_health / 3.f) * m_healthBar.getWidth(), 32.f };
	m_healthBar.render(Camera::getInstance().m_collisionBox.position.x + 32,
		Camera::getInstance().m_collisionBox.position.y + 64, &_healthBarClip);

	Rectf _box = { Camera::getInstance().m_collisionBox.position.x + 32,
		Camera::getInstance().m_collisionBox.position.y + 64, 256.f, 32.f };
	renderEmptyBox(_box, color(0, 0, 0, 255));
}

void Player::handleEvents()
{
	m_velocityGoal = { 0, 0 };
    const Uint8* _currentKeyStates = SDL_GetKeyboardState( NULL );

    if (_currentKeyStates[SDL_SCANCODE_W])        m_velocityGoal.y = (float)-m_playerSpeed;
    if (_currentKeyStates[SDL_SCANCODE_A])        m_velocityGoal.x = (float)-m_playerSpeed;
    if (_currentKeyStates[SDL_SCANCODE_S])        m_velocityGoal.y = (float)m_playerSpeed;
    if (_currentKeyStates[SDL_SCANCODE_D])        m_velocityGoal.x = (float)m_playerSpeed;
	if (_currentKeyStates[SDL_SCANCODE_SPACE])    m_weapon->action();

	if (g_event.type == SDL_MOUSEBUTTONDOWN)
		m_weapon->action();
}

//Collision for player to tile handling
void Player::checkCollisionTypes(
	Tile* tileTypes,
	int dimW)
{
	for (int i = 0; i < 5; i++)
		for (int ii = 0; ii < 5; ii++)
			if((i + (int)floor(m_collisionBox.position.y / 16)) * dimW + (ii + (int)floor(m_collisionBox.position.x / 16)) > 0)
				if (Collision(m_collisionBox, tileTypes[(i + (int)floor(m_collisionBox.position.y / 16)) * dimW +
					(ii + (int)floor(m_collisionBox.position.x / 16))].m_collisionBox))
				{
					switch (tileTypes[(i + (int)floor(m_collisionBox.position.y / 16)) * dimW +
						(ii + (int)floor(m_collisionBox.position.x / 16))].m_id)
					{
						case 1: //Solid
						{
							m_isCollided = true;
						} break;

						case 2: //Slow
						{
							m_playerSpeed = 2;
						} break;

						case 3: //Slippery
						{
							m_slipAmount = 10;
							m_playerSpeed = 6;
						} break;

						case 4: //Solid
						{
							m_isCollided = true;
						} break;

						case 5: //Solid
						{
							m_isCollided = true;
						} break;
					}
				}
}

void Player::update(
	float deltaTime,
	Tile* tileTypes,
	int dimW,
	int dimH)
{
	static Vector2f _tempVelocity;
	m_playerSpeed = 4;
	m_slipAmount = 20;

	//Linear Interpolate the player's velocity
	_tempVelocity.x = lerpApproach(m_velocityGoal.x, _tempVelocity.x, deltaTime * m_slipAmount);
	_tempVelocity.y = lerpApproach(m_velocityGoal.y, _tempVelocity.y, deltaTime * m_slipAmount);
	m_velocity = _tempVelocity * deltaTime * 100;
	m_velocity.normalized();

	//Update x values to allow wall sliding
	m_isCollided = false;
	m_position.x = m_position.x + m_velocity.x;
	m_collisionBox = { Vector2f(m_position.x + 20, m_position.y + 20), 32, 32 };
	checkCollisionTypes(tileTypes, dimW);
	if (m_isCollided || m_collisionBox.position.x < 0 || m_collisionBox.position.x + m_collisionBox.width > dimW * 16)
		m_position.x = m_position.x - m_velocity.x;

	//Update y values to allow wall sliding
	m_isCollided = false;
	m_position.y = m_position.y + m_velocity.y;
	m_collisionBox = { Vector2f(m_position.x + 20, m_position.y + 20), 32, 32 };
	checkCollisionTypes(tileTypes, dimW);
	if (m_isCollided || m_collisionBox.position.y < 0 || m_collisionBox.position.y + m_collisionBox.height > dimH * 16)
		m_position.y = m_position.y - m_velocity.y;

	m_collisionCircle.setPosition(Vector2f(m_position.x + 4, m_position.y + 4));
	m_collisionCircle.update(deltaTime);

	//Moves the camera and makes sure the camera doesen't scroll past the map.
	Camera::getInstance().m_collisionBox.position.x = m_position.x - SCREEN_WIDTH / 2;
	Camera::getInstance().m_collisionBox.position.y = m_position.y - SCREEN_HEIGHT / 2;
	if (Camera::getInstance().m_collisionBox.position.x < 0) Camera::getInstance().m_collisionBox.position.x = 0;
	if (Camera::getInstance().m_collisionBox.position.y < 0) Camera::getInstance().m_collisionBox.position.y = 0;
	if (Camera::getInstance().m_collisionBox.position.x + Camera::getInstance().m_collisionBox.width > dimW * 16)
		Camera::getInstance().m_collisionBox.position.x = dimW * 16.f - Camera::getInstance().m_collisionBox.width;
	if (Camera::getInstance().m_collisionBox.position.y + Camera::getInstance().m_collisionBox.height > dimH * 16)
		Camera::getInstance().m_collisionBox.position.y = dimH * 16.f - Camera::getInstance().m_collisionBox.height;

	//Update the weapon rotation and angle
	m_weapon->update(m_position, m_angle, deltaTime);
	m_direction = Cursor::getInstance().getPosition() -
		Vector2f(m_position.x + m_collisionBox.width / 2, m_position.y + m_collisionBox.height / 2);
	m_direction = m_direction.normalized();
	m_angle = (float)(atan2(m_direction.y, m_direction.x) * (180.f / PI));
	m_direction = Cursor::getInstance().getPosition() - m_weapon->getPosition();
	m_direction = m_direction.normalized();
    m_weapon->setDirection(m_direction);
}
