#include "entity/bosses/pikachuboss.h"

PikachuBoss::PikachuBoss()
{
	m_texture.loadFromFile("res/Enemy/Boss/Pikachu/PikachuImage.png", 374, 333);
	m_position = { SCREEN_WIDTH / 2 - (m_texture.getWidth() / 2.f), 0 };
	m_Projectiles = new Projectile[MAX_PROJECTILE_AMOUNT];
	m_phaseNumber = 1;
	m_songTimer.start();

	//Boundaries
	for (int i = 0; i < 5; i++)
	{
		m_Projectiles[i].setCircleType(4);
		m_Projectiles[i].setColor(color(255, 255, 0, 255));
		m_Projectiles[i].setPosition(Vector2f(250.f, 320.f + i * 64));
		m_Projectiles[i].setActive(true);
	}

	for (int i = 0; i < 5; i++)
	{
		m_Projectiles[i + 5].setCircleType(4);
		m_Projectiles[i + 5].setColor(color(255, 255, 0, 255));
		m_Projectiles[i + 5].setPosition(Vector2f(SCREEN_WIDTH - 250.f, 320.f + i * 64));
		m_Projectiles[i + 5].setActive(true);
	}

	//random360
	for (int i = 10; i < 500; i++)
	{
		m_Projectiles[i].setCircleType(4);
		m_Projectiles[i].setColor(color(255, 255, 0, 255));
	}
}

PikachuBoss::~PikachuBoss()
{
	delete m_Projectiles;
}

void PikachuBoss::render()
{
	m_texture.render(0 + 128, 0);
	m_texture.render(SCREEN_WIDTH / 2 - (m_texture.getWidth() / 2.f), 0);
	m_texture.render(SCREEN_WIDTH - m_texture.getWidth() - 128.f, 0);

	for (int i = 0; i < MAX_PROJECTILE_AMOUNT; i++)
	{
		if (m_Projectiles[i].isActive())
		{
			m_Projectiles[i].render();
		}
	}
}

void PikachuBoss::update(float deltaTime)
{
	for (int i = 0; i < MAX_PROJECTILE_AMOUNT; i++)
	{
		if (m_Projectiles[i].isActive())
		{
			m_Projectiles[i].update(deltaTime);
		}
	}

	phaseOne();
}

void PikachuBoss::phaseOne()
{
	random360();
}

void PikachuBoss::attackOne()
{
	if(m_songTimer.getTicks() > 1000)
	{

	}
}

void PikachuBoss::attackTwo()
{

}

void PikachuBoss::attackThree()
{

}

void PikachuBoss::random360()
{
	static Timer _repeatedTimer(true);
	static auto _index = 10;

	if(_repeatedTimer.getTicks() >= 20)
	{
		_repeatedTimer.start();
		if(_index >= 500)
			_index = 10;
		float r1 = static_cast <float> (rand()) / static_cast <float> (RAND_MAX/2.f);
		float r2 = static_cast <float> (rand()) / static_cast <float> (RAND_MAX/2.f);
		Vector2f _direction = { r1 - 1.f, r2 - 1.f };
		_direction = _direction.normalized();
		m_Projectiles[_index].reload(m_position, _direction, 0, 200);
		m_Projectiles[_index].setActive(true);
		m_Projectiles[_index].setColor(color(rand() % 255, rand() % 255, rand() % 255, 255));
		_index++;
	}
}
