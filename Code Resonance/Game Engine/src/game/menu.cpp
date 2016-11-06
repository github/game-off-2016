#include "game/menu.h"

Menu::Menu()
{
	m_background.loadFromFile("res/GUI/menu-background.png", 1280, 720);
	m_menuTheme.loadMusicFile("res/Music/bgm/Firestorm.ogg", 80);
	//m_menuTheme.repeatMusic();

	GLfloat offsetWidth = SCREEN_WIDTH * 0.75;

	addButton(m_buttons, "Play Game", Vector2f(offsetWidth, SCREEN_HEIGHT / 6), SCREEN_WIDTH / 4, SCREEN_HEIGHT / 7);
	addButton(m_buttons, "Map Editor", Vector2f(offsetWidth, SCREEN_HEIGHT / 3), SCREEN_WIDTH / 4, SCREEN_HEIGHT / 7);
	addButton(m_buttons, "How to Play", Vector2f(offsetWidth, SCREEN_HEIGHT / 2), SCREEN_WIDTH / 4, SCREEN_HEIGHT / 7);
	addButton(m_buttons, "Options", Vector2f(offsetWidth, SCREEN_HEIGHT - (SCREEN_HEIGHT / 3)), SCREEN_WIDTH / 4, SCREEN_HEIGHT / 7);
	addButton(m_buttons, "Exit Game", Vector2f(offsetWidth, SCREEN_HEIGHT - (SCREEN_HEIGHT / 6)), SCREEN_WIDTH / 4, SCREEN_HEIGHT / 7);

	g_isPlayerDead = false;
}

Menu::~Menu()
{
	for (unsigned int i = 0; i < m_buttons.size(); i++)
		delete m_buttons[i];
}

void Menu::render() const
{
	m_background.render(0, 0, NULL, (GLfloat)SCREEN_WIDTH, (GLfloat)SCREEN_HEIGHT);

	for (unsigned int i = 0; i < m_buttons.size(); i++)
		m_buttons[i]->render();

	Cursor::getInstance().render();
}

void Menu::update(
	float deltaTime)
{
	//Play Game
	if (m_buttons[0]->getClicked())
	{
		g_gameState = new SelectionState(false, &m_menuTheme);
		g_showCollisionBox = false;
	}
	//Editor State
	if (m_buttons[1]->getClicked())
	{
		g_gameState = new SelectionState(true, &m_menuTheme);
		g_showCollisionBox = true;
	}
	//Exit Game
	if (m_buttons[4]->getClicked())
		Application::getInstance().setAppState(APP_EXITING);

	Cursor::getInstance().update(deltaTime);
}

void Menu::handleEvents()
{
	for (unsigned int i = 0; i < m_buttons.size(); i++)
		m_buttons[i]->handleEvents();

	while(SDL_PollEvent(&g_event))
	{
		if (g_event.type == SDL_QUIT)
			Application::getInstance().setAppState(APP_EXITING);
	}
}
