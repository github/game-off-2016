#include "engine\game\world\map\ZoneMap.h"

#include <direct.h>
#include <fstream>

ZoneMap::ZoneMap()
{
}

ZoneMap::~ZoneMap()
{
	clear();
}

void ZoneMap::setViewSize(Rect p_viewSize)
{
	m_viewSize = p_viewSize;
}
void ZoneMap::setLayerVisible(Sint16 p_layer, bool p_visible)
{
	m_layerVisible[p_layer] = p_visible;
}
void ZoneMap::setGridVisible(bool p_active)
{
	m_grid = p_active;
}

void ZoneMap::setName(std::string p_zoneName)
{
	m_zoneName = p_zoneName;
}
std::string ZoneMap::getName()
{
	return m_zoneName;
}
Vector2<Uint16> ZoneMap::getSize()
{
	return m_zoneSize;
}


Uint16 ZoneMap::addWorldObject(Uint8 p_layer, WorldObject p_object)
{
	m_worldObjects[p_layer].push_back(p_object);
	return Uint16(m_worldObjects[p_layer].size());
}
ZoneMap::WorldObject& ZoneMap::getWorldObject(Uint8 p_layer, Uint16 p_index)
{
	return m_worldObjects[p_layer][p_index];
}
Uint16 ZoneMap::getWorldObjectSize(Uint8 p_layer)
{
	return Uint16(m_worldObjects[p_layer].size());
}
void ZoneMap::removeWorldObject(Uint8 p_layer, Uint16 p_index)
{
	m_worldObjects[p_layer].erase(m_worldObjects[p_layer].begin() + p_index);
}

void ZoneMap::render(Vector2<Sint32> p_camPos)
{
	glColor3f(1, 1, 1);

	glBindTexture(GL_TEXTURE_2D, 0);

	if(m_layerVisible[0])
	{
		for(Uint16 i = 0; i < m_worldObjects[0].size(); i++)
		{
			glBegin(GL_POLYGON);
			{
				for(Uint16 j = 0; j < m_worldObjects[0][i].m_vertices.size(); j++)
				{
					glVertex2f(m_worldObjects[0][i].m_vertices[j].x, m_worldObjects[0][i].m_vertices[j].y);
				}
			}
			glEnd();
		}
	}



	if(m_layerVisible[1])
	{
		
	}



	if(m_layerVisible[2])
	{
		
	}



	glBindTexture(GL_TEXTURE_2D, 0);

	if(m_grid)
	{
		glColor4f(0.75f, 0.75f, 0.75f, 0.5f);

		for(Sint32 x = Sint32(floor(m_viewSize.x)) - 1; x <= Sint32(ceil(m_viewSize.w) - 1); x++)
		{
			if(x + p_camPos.x >= 0 && x + p_camPos.x < getSize().x + 1)
			{
				glPushMatrix();
				{
					glTranslatef(GLfloat(fmod(-p_camPos.x + (p_camPos.x < 0 ? -1 : 0), 1) + (p_camPos.x < 0 ? 0 : 1)) + (p_camPos.x < 0 ? 1 : 0), 0, 0);
					glBegin(GL_LINES);
					{
						glVertex2f(GLfloat(x), GLfloat(max(m_viewSize.y, -p_camPos.y)));
						glVertex2f(GLfloat(x), GLfloat(min(m_viewSize.h, -p_camPos.y + getSize().y)));
					}
					glEnd();
				}
				glPopMatrix();
			}
		}
		for(Sint32 y = Sint32(floor(m_viewSize.y)) - 1; y <= Sint32(ceil(m_viewSize.h) - 1); y++)
		{
			if(y + p_camPos.y >= 0 && y + p_camPos.y < getSize().y + 1)
			{
				glPushMatrix();
				{
					glTranslatef(0, GLfloat(fmod(-p_camPos.y + (p_camPos.y < 0 ? -1 : 0), 1) + (p_camPos.y < 0 ? 0 : 1)) + (p_camPos.y < 0 ? 1 : 0), 0);
					glBegin(GL_LINES);
					{
						glVertex2f(GLfloat(max(m_viewSize.x, -p_camPos.x)), GLfloat(y));
						glVertex2f(GLfloat(min(m_viewSize.w, -p_camPos.x + getSize().x)), GLfloat(y));
					}
					glEnd();
				}
				glPopMatrix();
			}
		}
	}
}

void ZoneMap::save()
{
	save(m_zoneName);
}
void ZoneMap::save(std::string p_zoneName)
{
	std::cout << "Saving map zones\\" << p_zoneName << "... ";

	m_zoneName = p_zoneName;
	std::ofstream _file;
	_mkdir(std::string("zones\\").c_str());
	_mkdir(std::string("zones\\" + m_zoneName).c_str());
	_mkdir(std::string("zones\\" + m_zoneName + "\\entities").c_str());
	_file.open(std::string("zones\\" + m_zoneName + "\\Info.cfg"), std::ios::binary);
	{
		FileExt::writeShort(_file, m_zoneSize.x);
		FileExt::writeShort(_file, m_zoneSize.y);
	}
	_file.close();

	_file.open(std::string("zones\\" + m_zoneName + "\\Ground.tmf"));
	{

	}
	_file.close();

	_file.open(std::string("zones\\" + m_zoneName + "\\World.tmf"));
	{
		
	}
	_file.close();

	_file.open(std::string("zones\\" + m_zoneName + "\\Entity.tmf"));
	{
		
	}
	_file.close();

	_file.open(std::string("zones\\" + m_zoneName + "\\Sky.tmf"));
	{

	}
	_file.close();

	std::cout << "Complete." << std::endl;
}

bool ZoneMap::load()
{
	return load(m_zoneName);
}

bool ZoneMap::load(std::string p_zoneName)
{
	std::cout << "Loading map zones\\" << p_zoneName << "... ";

	std::ifstream _file;
	_file.open(std::string("zones\\" + p_zoneName + "\\Info.cfg").c_str(), std::ios::binary);
	{
		if(!_file.good())
		{
			std::cout << "No Info.cfg file found." << std::endl;
			return false;
		}
	}
	_file.close();
	_file.open(std::string("zones\\" + p_zoneName + "\\Ground.tmf").c_str(), std::ios::binary);
	{
		if(!_file.good())
		{
			std::cout << "No Ground.tmf file found." << std::endl;
			return false;
		}
	}
	_file.close();
	_file.open(std::string("zones\\" + p_zoneName + "\\World.tmf").c_str(), std::ios::binary);
	{
		if(!_file.good())
		{
			std::cout << "No World.tmf file found." << std::endl;
			return false;
		}
	}
	_file.close();
	_file.open(std::string("zones\\" + p_zoneName + "\\Entity.tmf").c_str(), std::ios::binary);
	{
		if(!_file.good())
		{
			std::cout << "No Entity.tmf file found." << std::endl;
			return false;
		}
	}
	_file.close();
	_file.open(std::string("zones\\" + p_zoneName + "\\Sky.tmf").c_str(), std::ios::binary);
	{
		if(!_file.good())
		{
			std::cout << "No Sky.tmf file found." << std::endl;
			return false;
		}
	}
	_file.close();



	clear();

	m_zoneName = p_zoneName;

	Uint32 _length, _index;
	char* _data;
	_file.open(std::string("zones\\" + p_zoneName + "\\Info.cfg").c_str(), std::ios::binary);
	{

	}
	_file.close();

	Uint16 _tileCount;
	Uint16 _tileId, _mapIndex;

	_file.open(std::string("zones\\" + p_zoneName + "\\Ground.tmf").c_str(), std::ios::binary);
	{

	}
	_file.close();

	_file.open(std::string("zones\\" + p_zoneName + "\\World.tmf").c_str(), std::ios::binary);
	{

	}
	_file.close();

	_file.open(std::string("zones\\" + p_zoneName + "\\Entity.tmf").c_str(), std::ios::binary);
	{

	}
	_file.close();

	_file.open(std::string("zones\\" + p_zoneName + "\\Sky.tmf").c_str(), std::ios::binary);
	{

	}
	_file.close();

	std::cout << "Complete." << std::endl;

	return true;
}

void ZoneMap::createNew()
{
	std::cout << "Clearing map... ";
	clear();
	std::cout << "Complete." << std::endl;
}

void ZoneMap::clear()
{
	for(Uint8 i = 0; i < 3; i++)
	m_worldObjects[i].clear();
}
