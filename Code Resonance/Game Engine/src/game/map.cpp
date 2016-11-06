#include "game/map.h"

Map::Map(
	std::string filename,
	std::string worldName)
{
	m_solidTiles = NULL;
	m_filename = filename;
	m_worldName = worldName;

	loadMap(filename);

	if (m_worldName == "Satori")
	{
		printf("Boss is Satori\n");
		m_levelBgm.loadMusicFile("res/Music/bgm/3rdeyerag.ogg", 100);
		m_levelBgm.playMusic();
	}
	else if (m_worldName == "Pikachu")
	{
		printf("Boss is Pikachu\n");
		m_levelBgm.loadMusicFile("res/Music/bgm/pikachunouta.ogg", 100);
		m_levelBgm.playMusic();
	}
	else
	{

	}

	//enemyEntities.push_back(e);

}

Map::~Map()
{
	delete[] m_solidTiles;
}

void Map::render()
{
	m_background.render(0, 0);
}

void Map::renderSolidTiles()
{
    for(int i = 0; i < m_height; i++)
		for (int ii = 0; ii < m_width; ii++)
		{
			//Rectf box = { ii * 16, i * 16, 16.f, 16.f};
			//renderEmptyBox(box);
			m_solidTiles[i * m_width + ii].render();
		}
}

/*void Map::renderObjectTiles()
{
	for (int i = 0; i < SCREEN_HEIGHT / 32 + 2; i++)
		for (int ii = 0; ii < SCREEN_WIDTH / 32 + 2; ii++)
		{
			int index = (i + (int)(floor(Camera::getInstance().collisionBox.position.y / 32))) * width + (ii + (int)(floor(Camera::getInstance().collisionBox.position.x / 32)));

			if (m_tileTypes[index].id != 0)
				m_tileTypes[index].Render();
		}

	for (unsigned int i = 0; i < m_enemyEntities.size(); i++)
		m_enemyEntities[i]->Render();
}
*/

inline static void writeInt(
	std::ofstream& p_fileStream,
	GLuint p_uint)
{
	p_fileStream << GLubyte((p_uint & 0xFF000000) >> 24);
	p_fileStream << GLubyte((p_uint & 0xFF0000) >> 16);
	p_fileStream << GLubyte((p_uint & 0xFF00) >> 8);
	p_fileStream << GLubyte((p_uint & 0xFF));
}

inline static void writeShort(
	std::ofstream& p_fileStream,
	GLushort p_ushort)
{
	p_fileStream << GLubyte((p_ushort & 0xFF00) >> 8);
	p_fileStream << GLubyte((p_ushort & 0xFF));
}

inline static void writeChar(
	std::ofstream& p_fileStream,
	GLubyte p_uchar)
{
	p_fileStream << p_uchar;
}

void Map::newMap(
	GLubyte width,
	GLubyte height,
	GLubyte backgroundNumber,
	std::string filename)
{
	m_width = width;
	m_height = height;
	m_backgroundNumber = backgroundNumber;
	m_filename = filename;

	printf("Creating new file: %s\n", m_filename.c_str());

	std::cout << "Saving map " << m_filename << std::endl;

	_mkdir(std::string("Levels\\").c_str());
	std::ofstream _file(m_filename, std::ios::binary);

	_file << ".OPO";
	writeChar(_file, m_backgroundNumber);
	writeChar(_file, m_width);
	writeChar(_file, m_height);

	writeShort(_file, 0);
	writeShort(_file, 0);

	for (int i = 0; i < m_width * m_height; i++)
	{
		m_solidTiles[i].m_id = 0;
	}

	GLubyte _lastId = 0;
	GLubyte _count = 0;
	for (int i = 0; i < m_width * m_height; i++)
	{
		if (_count >= 255 || (int)_lastId != (int)m_solidTiles[i].m_id)
		{
			if (_count > 0)
			{
				writeChar(_file, _count);
				writeChar(_file, _lastId);
				_count = 0;
			}
			_lastId = m_solidTiles[i].m_id;
		}
		_count++;
	}
	if (_count > 0)
	{
		writeChar(_file, _count);
		writeChar(_file, _lastId);
		_count = 0;
	}

	_file.close();

	std::cout << "Map created." << std::endl;
}

void Map::saveMap()
{
	std::cout << "Saving map " << m_filename << std::endl;

	_mkdir(std::string("Levels\\").c_str());
	std::ofstream _file(m_filename, std::ios::binary);

	_file << ".OPO";
	writeChar(_file, m_backgroundNumber);
	writeChar(_file, m_width);
	writeChar(_file, m_height);

	writeShort(_file, (GLushort)m_playerSpawnPosition.x);
	writeShort(_file, (GLushort)m_playerSpawnPosition.y);

	GLubyte _lastId = 0;
	GLubyte _count = 0;
	for (int i = 0; i < m_width * m_height; i++)
	{
		if (_count >= 255 || (int)_lastId != (int)m_solidTiles[i].m_id)
		{
			if (_count > 0)
			{
				writeChar(_file, _count);
				writeChar(_file, _lastId);
				_count = 0;
			}
			_lastId = m_solidTiles[i].m_id;
		}
		_count++;
	}
	if (_count > 0)
	{
		writeChar(_file, _count);
		writeChar(_file, _lastId);
		_count = 0;
	}

	_file.close();

	std::cout << "Map saved." << std::endl;
}

inline static GLubyte readChar(
	char* p_file,
	long& p_index)
{
	p_index = p_index + 1;
	return GLubyte(p_file[p_index - 1]);
}

inline static GLushort readShort(
	char* p_file,
	long& p_index)
{
	GLushort _value;
	_value = readChar(p_file, p_index) << 8;
	_value += readChar(p_file, p_index);
	return _value;
}

inline static GLuint readInt(
	char* p_file,
	long& p_index)
{
	GLushort _value;
	_value = readShort(p_file, p_index) << 16;
	_value += readShort(p_file, p_index);
	return _value;
}

int Map::loadMap(
	std::string p_filename)
{
	printf("Reading %s of file %s\n", m_worldName.c_str(), p_filename.c_str());

	std::ifstream _file;
	_file.open(p_filename.c_str(), std::ios::binary);

	if(!_file.good())
	{
		std::cout << "Error finding file " << p_filename << "." << std::endl;
		return 1;
	}

	_file.seekg(0, _file.end);
	std::streamoff _len = _file.tellg();
	_file.seekg(0, _file.beg);

	long _index = 0;
	char* _data = new char[(GLuint)_len];
	_file.read(_data, _len);

	if(_data[0] != '.' || _data[1] != 'O' || _data[2] != 'P' || _data[3] != 'O')
	{
		std::cout << "First 4 characters are not .OPO, file not trusted." << std::endl;
		//newMap(1280.f, 720.f, 0.f, "temporary.opo");
		return 2;
	}
	_index = 4;

	m_backgroundNumber = readChar(_data, _index);
	m_background.loadFromFile(std::string("res\\Backgrounds\\").append(1, m_backgroundNumber + '0').append(".png").c_str(), 1280, 1080);
	std::string backgroundFile = std::string("res\\Backgrounds\\").append(1, m_backgroundNumber + '0').append(".png");
	printf("Background number: %d  // Background: %s\n", m_backgroundNumber, backgroundFile.c_str());

	m_width = readChar(_data, _index);
	m_height = readChar(_data, _index);
	GLushort _x = readShort(_data, _index);
	GLushort _y = readShort(_data, _index);
	m_playerSpawnPosition = Vector2f(_x, _y);
	printf("Map Width: %d\nMap Height: %d \nPlayer Spawn: (%d, %d)\n",
		m_width, m_height, (int)m_playerSpawnPosition.x, (int)m_playerSpawnPosition.y);

	int i = 0;
	GLubyte _amt = 0;
	GLubyte _id = 0;
	if(m_solidTiles != NULL)
		delete[] m_solidTiles;
	m_solidTiles = new Tile[m_width * m_height];
	while (_index < _len)
	{
		_amt = readChar(_data, _index);
		_id = readChar(_data, _index);
		for (int j = 0; j < _amt; j++)
		{
			m_solidTiles[i] = Tile(Vector2f((GLfloat)(i % m_width), floor((GLfloat)i / m_width)) * 16, _id);
			i++;
		}
	}
	printf("Map Loaded\n\n");

	_file.close();
	delete[] _data;
	return 0;
}

Tile::Tile() :
	m_id(0)
{
	m_collisionBox = { Vector2f(0, 0), 32, 32 };
}
Tile::Tile(
	Vector2f pos,
	GLubyte tileType) :
	m_id(tileType)
{
	m_collisionBox = { pos, 32, 32 };
}

void Tile::render()
{
	Rectf box = { m_collisionBox.position.x, m_collisionBox.position.y, 16.f, 16.f };
	//if (g_showCollisionBox) renderEmptyBox(box, color(64, 64, 64, 128));
	if (g_showCollisionBox)
	{
		switch(m_id)
		{
			case 0: //No collision - transparent
			{

			} break;
			case 1: //Solid - GRAY
			{
				renderFillRect(box, color(200, 200, 200, 255));
			} break;
			case 2: //Slow - GREEN
			{
				renderFillRect(box, color(0, 255, 0, 128));
			} break;
			case 3: //Slippery - BLUE
			{
				renderFillRect(box, color(0, 0, 255, 128));
			} break;
			case 4: //DEATH - RED
			{
				renderFillRect(box, color(255, 0, 0, 128));
			} break;
		}
	}
}

///Tile Colors///
/*
Solid Layer Types:
0 - No Collision - Transparent
1 - Solid - RED
2 - Slow - GREEN
3 - Slippery - BLUE
*/
