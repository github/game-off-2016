#pragma once

#include "game/gamestate.h"
#include "game/map.h"
#include "game/menu.h"
#include "game/camera.h"

#include "entity/player.h"
#include "entity/boss.h"

class Level : public GameState
{
    public:
		Level(
			std::string filename,
			std::string worldName);
        ~Level();

        void render() const;
        void update(
			float deltaTime);
        void handleEvents();

    private:
		Map* m_dungeon;
		Boss* m_boss;
};
