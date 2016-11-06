#pragma once

#include <cstring>
#include <sstream>

#include "game/gamestate.h"
#include "game/level.h"
#include "game/camera.h"
#include "game/map.h"

#include "entity/player.h"

#include "gfx/texture.h"

#include "utils/dirent.h"
#include "utils/gui/button.h"

class EditorState : public GameState
{
	public:
		EditorState(
			std::string filename,
			std::string worldName);
		~EditorState();

		void render() const;
		void update(
			float deltaTime);
		void handleEvents();
	private:
		DIR* m_dir;
		struct dirent *m_ent;

		bool m_goToEditorState;

		Map* m_dungeon;

		Uint8 m_id;
		std::stringstream m_selectorID;
		Texture m_selectorText;
};
