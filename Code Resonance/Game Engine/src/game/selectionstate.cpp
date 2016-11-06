#include "game/selectionstate.h"

SelectionState::SelectionState(
	bool goToEditor,
	Bgm *menuTheme) :
	m_goToEditorState(goToEditor)
{
	m_menuTheme = *menuTheme;
	changeFontSize(64);

	m_previewBackground.loadFromFile("res/GUI/menu-background.png", 1280, 720);

	int _index = 0;
	int _skip = 0; //skip . and ..

	printf("Loading levels...\n");

	m_dir = opendir("./Levels");
	if (m_dir)
	{
		while (m_ent = readdir(m_dir))
		{
			if (_skip < 2)
			{
				_skip++;
				continue;
			}
			addSelectionItem(m_selectionItems, m_ent->d_name,
				Vector2f(SCREEN_WIDTH * 0.66f, (GLfloat)_index * SCREEN_HEIGHT / 8), SCREEN_WIDTH / 3, SCREEN_HEIGHT / 8);

			_index++;
		}
		closedir(m_dir);
	}
	else
		printf("Error: Opening directory \n");

	Camera::getInstance().setCoords(Vector2f(0, 0));

	changeFontSize(16);
}

SelectionState::~SelectionState()
{
	for (unsigned int i = 0; i < m_selectionItems.size(); i++)
		delete m_selectionItems[i];
}

void SelectionState::render() const
{
	Camera::getInstance().update();

	m_previewBackground.render(0, 0, NULL, (GLfloat)SCREEN_WIDTH, (GLfloat)SCREEN_HEIGHT);

	for (unsigned int i = 0; i < m_selectionItems.size(); i++)
		if (Collision(Camera::getInstance().m_collisionBox, m_selectionItems[i]->getCollisionBox()))
			m_selectionItems[i]->render();

	Cursor::getInstance().render();
}

void SelectionState::update(
	float deltaTime)
{
	if (Camera::getInstance().m_collisionBox.position.y + Camera::getInstance().m_collisionBox.height >
		(SCREEN_HEIGHT / 8 * m_selectionItems.size())) Camera::getInstance().m_collisionBox.position.y =
		(SCREEN_HEIGHT / 8 * m_selectionItems.size()) - (float)Camera::getInstance().m_collisionBox.height;
	if (Camera::getInstance().m_collisionBox.position.y < 0) Camera::getInstance().m_collisionBox.position.y = 0;

	for (unsigned int i = 0; i < m_selectionItems.size(); i++)
	{
		if (m_selectionItems[i]->getClicked())
		{
			m_menuTheme.stopMusic();
			std::string filepath = "Levels/" + m_selectionItems[i]->getWorldName();

			if (m_goToEditorState)
				g_gameState = new EditorState(filepath, m_selectionItems[i]->getWorldName());
			else
				g_gameState = new Level(filepath, m_selectionItems[i]->getWorldName());
		}
	}

	Cursor::getInstance().update(deltaTime);
}

void SelectionState::handleEvents()
{
	if (g_event.type == SDL_MOUSEWHEEL)
		Camera::getInstance().addCoords(Vector2f(0.f, -g_event.wheel.y * 10.f));

	if (g_event.type == SDL_KEYDOWN)
		if (g_event.key.keysym.sym == SDLK_ESCAPE)
		{
			changeFontSize(64);
			delete g_gameState;
			g_gameState = new Menu();
		}
	for (unsigned int i = 0; i < m_selectionItems.size(); i++)
		m_selectionItems[i]->handleEvents();

	while(SDL_PollEvent(&g_event))
	{
		if (g_event.type == SDL_QUIT)
		{
			changeFontSize(64);
			g_gameState = new Menu();
		}
	}
}
