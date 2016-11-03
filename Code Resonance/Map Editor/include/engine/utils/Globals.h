#pragma once
#include "engine\utils\variable\datatype\Macros.h"
#include "engine\utils\variable\datatype\Vector2.h"
#include "engine\utils\Singleton.h"
#include <vector>

class Globals : public Singleton< Globals >
{
public:

	Globals() {};
	Globals(const Globals&) {};
	Globals operator=(const Globals&) {};

	float m_fps;
	Vector2<Sint32> m_screenSize;
	Vector2<Sint32> m_mousePos;
	bool m_developer;
	Sint8 m_keyStates[1024];
	Sint8 m_specStates[256];
	Sint8 m_mouseStates[64];
	Sint8 m_mouseScroll;
	Sint8 m_exitting;

	struct keyPress
	{
		Sint32 m_keyCode;
		Sint32 m_scanCode;
		Sint32 m_action;
		Sint32 m_mods;
	};
	std::vector<keyPress> m_keyEvents;

	float m_timeWarp = 1;


	enum GameState
	{
		MENU_START,
		MENU_MAIN,
		GAME_PAUSE,
		GAME_PLAY
	};

	GameState m_gameState;
};
