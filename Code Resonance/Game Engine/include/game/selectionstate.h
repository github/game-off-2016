#pragma once

#include <cstring>

#include "game/menu.h"
#include "game/gamestate.h"
#include "game/editorstate.h"
#include "game/level.h"
#include "game/camera.h"

#include "entity/player.h"

#include "gfx/texture.h"

#include "utils/dirent.h"
#include "utils/gui/button.h"
#include "utils/gui/selectionitem.h"

class SelectionState : public GameState
{
	public:
		SelectionState(
			bool goToEditor,
			Bgm *menuTheme);
		~SelectionState();

		void render() const;
		void update(
			float deltaTime);
		void handleEvents();
	private:
		Texture m_previewBackground;

		std::vector<SelectionItem*> m_selectionItems;

		DIR* m_dir;
		struct dirent *m_ent;

		bool m_goToEditorState;

		Bgm m_menuTheme;
};
