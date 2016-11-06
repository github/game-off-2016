#pragma once

#include <iostream>
#include <vector>
#include <fstream>
#include <cmath>
#include <string>
#include <direct.h>

#include "game/camera.h"

#include "entity/enemy.h"

#include "gfx/spritesheet.h"
#include "gfx/texutils.h"

#include "sfx/music.h"

#include "utils/Vector2f.h"
#include "physics/AABB.h"

class Tile
{
	public:
		Tile();
		Tile(
			Vector2f pos,
			GLubyte tileType);

		void render();

		AABB m_collisionBox;
		GLubyte m_id; //on the tilesheet
};

class Map
{
    public:
		Map(std::string filename,
			std::string worldName);
        ~Map();

		void render();
        void renderSolidTiles();

		void saveMap();
		int loadMap(
			std::string p_filename);
		std::string getFilename() { return m_filename; }

		void newMap(
			GLubyte width,
			GLubyte height,
			GLubyte backgroundNumber,
			std::string filename
		);

		Tile* getSolids() { return m_solidTiles; }

		GLubyte getDimW() const { return m_width; }
		GLubyte getDimH() const { return m_height; }

		Vector2f getPlayerSpawn() { return m_playerSpawnPosition; }
		void setPlayerSpawn(
			Vector2f spawnPos) { m_playerSpawnPosition = spawnPos; }

		void setSolid(
			GLuint tileIndex
			, Uint8 id) { m_solidTiles[tileIndex].m_id = id; }

		Bgm* getBgm() { return &m_levelBgm; }
	private:
		std::string m_filename;
		std::string m_worldName;

		Tile* m_solidTiles;
		std::vector<Enemy*> m_enemyEntities;

		Vector2f m_playerSpawnPosition;

		GLubyte m_backgroundNumber;
		Texture m_background;

        GLubyte m_width, m_height; //should be image res / 8

		Bgm m_levelBgm;
};
