#include "Application.h"

Vector2<Uint16> Application::m_screenSize = {};

bool Application::init()
{
	m_screenSize = Vector2<Uint16>(1280, 768);

	Globals::getInstance().m_developer = true;
	Globals::getInstance().m_fps = 0;
	Globals::getInstance().m_screenSize = m_screenSize;

	Globals::getInstance().m_gameState = Globals::getInstance().GAME_PLAY;
	Globals::getInstance().m_exitting = 0;

	for(Uint16 i = 0; i < 1024; i++)
		Globals::getInstance().m_keyStates[i] = 0;

	if(!glfwInit())
		return false;

	if(!glewInit())
		return false;

	m_screenSize = Globals::getInstance().m_screenSize;

	m_mainWindow = glfwCreateWindow(m_screenSize.x, m_screenSize.y, "ArchMapEditor v0.1", 0, 0);

	if(!m_mainWindow)
	{
		glfwTerminate();
		return false;
	}
	glfwSetKeyCallback(m_mainWindow, keyCallback);
	glfwSetMouseButtonCallback(m_mainWindow, mousePressCallback);
	glfwSetCursorEnterCallback(m_mainWindow, mouseEnterCallback);
	glfwSetCursorPosCallback(m_mainWindow, mouseMovedCallback);
	glfwSetScrollCallback(m_mainWindow, mouseScrollCallback);
	glfwSetWindowSizeCallback(m_mainWindow, windowResizeCallback);

	glfwSetWindowPos(m_mainWindow, 320, 200);

	glfwMakeContextCurrent(m_mainWindow);
	glClearColor(0.15f, 0.15f, 0.15f, 1);

	init2d();

	glEnable(GL_BLEND);
	glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

	Game::getInstance().init();

	return true;
}

double i;

void Application::run()
{
	while(Globals::getInstance().m_exitting != 2)
	{
		i = glfwGetTime();

		input();
		update();
		render();

		m_sleepTime = DWORD(max(1000 / m_maxFps - ((glfwGetTime() - i) * 1000), 0));
		if(m_sleepTime > 0)
			Sleep(m_sleepTime);
		Globals::getInstance().m_fps = 1.f / (float)(glfwGetTime() - i);
	}

	glfwTerminate();
}

void Application::keyCallback(GLFWwindow* p_window, int p_keycode, int p_scancode, int p_action, int p_mods)
{
	//std::cout << p_keycode << " " << p_scancode << " " << p_action << " " << p_mods << "\n";
	Globals::getInstance().m_keyEvents.push_back({p_keycode, p_scancode, p_action, p_mods});

	if(Globals::getInstance().m_developer && p_keycode == 96)
	{
		Globals::getInstance().m_exitting = 2;
		return;
	}

	//Globals::getInstance().m_keyStates[p_keycode] = bool(p_action != 0);
	if((Globals::getInstance().m_keyStates[p_keycode] != 0) != (p_action != 0))
	{
		if(Globals::getInstance().m_keyStates[p_keycode] == 0)
			Globals::getInstance().m_keyStates[p_keycode] = 1;
		else
			Globals::getInstance().m_keyStates[p_keycode] = 3;
	}

	if(p_keycode == GLFW_KEY_ESCAPE && p_action == 1)
	{
		if(Globals::getInstance().m_gameState == Globals::getInstance().GAME_PLAY)
		{
			Globals::getInstance().m_gameState = Globals::getInstance().GAME_PAUSE;
		}
		else if(Globals::getInstance().m_gameState == Globals::getInstance().GAME_PAUSE)
		{
			Globals::getInstance().m_gameState = Globals::getInstance().GAME_PLAY;
		}
	}
}

void Application::mousePressCallback(GLFWwindow* p_window, int p_button, int p_state, int p_mods)
{
	if((Globals::getInstance().m_mouseStates[p_button] != 0) != (p_state != 0))
	{
		if(Globals::getInstance().m_mouseStates[p_button] == 0)
			Globals::getInstance().m_mouseStates[p_button] = 1;
		else
			Globals::getInstance().m_mouseStates[p_button] = 3;
	}
}

void Application::mouseMovedCallback(GLFWwindow* p_window, double p_x, double p_y)
{
	Globals::getInstance().m_mousePos = Vector2<Sint32>(Sint32(p_x - m_screenSize.x / 2), Sint32(p_y - m_screenSize.y / 2));
}

void Application::mouseScrollCallback(GLFWwindow* p_window, double p_x, double p_y)
{
	Globals::getInstance().m_mouseScroll += Sint8(p_y);
}

void Application::windowResizeCallback(GLFWwindow* p_window, int p_x, int p_y)
{
	glfwSetWindowSize(p_window, m_screenSize.x, m_screenSize.y);
	//Globals::getInstance().m_screenSize = Vector2< Uint16 >(p_x, p_y);
	//m_screenSize = Vector2< Uint16 >(p_x, p_y);

	//glViewport(0, 0, m_screenSize.x, m_screenSize.y);

	//init2d();

	//Game::getInstance().resize();
}

void Application::mouseEnterCallback(GLFWwindow* p_window, int p_action) {}

void Application::init2d()
{
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	glOrtho(-m_screenSize.x / 2, m_screenSize.x / 2, m_screenSize.y / 2, -m_screenSize.y / 2, -2000.f, 2000.f);
	glMatrixMode(GL_MODELVIEW);
	glEnable(GL_TEXTURE_2D);
	glEnable(GL_SCISSOR_TEST);
	glLoadIdentity();
}

void Application::input()
{
	if(glfwWindowShouldClose(m_mainWindow))
	{
		glfwSetWindowShouldClose(m_mainWindow, false);
		Globals::getInstance().m_exitting = 1;
		std::cout << "test" << std::endl;
	}

	Globals::getInstance().m_keyEvents.clear();
	Globals::getInstance().m_mouseScroll = 0;

	for(Uint16 i = 0; i < 1024; i++)
	{
		if(Globals::getInstance().m_keyStates[i] == 1)
			Globals::getInstance().m_keyStates[i] = 2;
		if(Globals::getInstance().m_keyStates[i] == 3)
			Globals::getInstance().m_keyStates[i] = 0;
	}

	glfwPollEvents();

	Game::getInstance().input();
}

void Application::update()
{
	Game::getInstance().update();

	for(Uint16 i = 0; i < 64; i++)
	{
		if(Globals::getInstance().m_mouseStates[i] == 1)
			Globals::getInstance().m_mouseStates[i] = 2;
		if(Globals::getInstance().m_mouseStates[i] == 3)
			Globals::getInstance().m_mouseStates[i] = 0;
	}

	glfwSetWindowTitle(m_mainWindow, ("ArchMapEditor v0.1 - Map: \"" + Game::getInstance().getZoneName() + "\"").c_str());
}

void Application::render()
{
	Game::getInstance().render();

	glfwSwapBuffers(m_mainWindow);
	glClear(GL_COLOR_BUFFER_BIT);
}
