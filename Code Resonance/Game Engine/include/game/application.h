#pragma once

#include <iostream>
#include <sstream>
#include <ctime>

#include "utils/general.h"
#include "utils/singleton.h"
#include "utils/timer.h"

#include "gfx/texture.h"

#include "game/gamestate.h"
#include "game/camera.h"
#include "game/menu.h"
#include "game/level.h"

enum appstate {
    APP_INITIALZING,
    APP_RUNNING,
    APP_EXITING
};

class Application : public Singleton<Application>
{
    public:
        Application();
        ~Application();

        void run();
        void loop();

        void setAppState(appstate appState);

    private:
		SDL_GLContext m_context;

        appstate m_appState;

        Timer m_deltaTimer, m_fpsTimer;
        float deltaTime_f;

        Texture m_fpsTex;
        std::stringstream m_fpsTime;
        int m_countedFrames;
};
