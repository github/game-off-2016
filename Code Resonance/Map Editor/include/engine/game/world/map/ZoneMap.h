#pragma once

#pragma warning( disable : 6031 )

#include "engine\utils\variable\datatype\Macros.h"
#include "engine\utils\variable\datatype\Rectangle.h"
#include "engine\utils\variable\datatype\Vector2.h"

#include "engine\gfx\LTexture.h"

#include <string>

class ZoneMap
{
public:
	struct WorldObject // Mesh shape with properties
	{
		std::string m_name;
		Uint16 m_interactionType;
		Texture m_tileTex;
		std::vector<Vector2<Sint32>> m_vertices;

		WorldObject(std::string p_name, Uint16 p_interactionType, Texture p_tileTex = Texture())
		{
			m_name = p_name;
			m_interactionType = p_interactionType;
			m_tileTex = p_tileTex;
		}
	};

private:
	std::string m_zoneName;
	Rect m_viewSize;
	Vector2<Sint32> m_zoneOffset; // Signed distance of how far object with lowest x or y value is
	Vector2<Sint32> m_zoneSize; // Depends on location of every mesh
	bool m_grid; // Show grid
	std::vector<WorldObject> m_worldObjects[3]; // Back, middle, fore

	bool m_layerVisible[3];

public:
	ZoneMap();
	~ZoneMap();

	void setViewSize(Rect p_viewSize);
	void setLayerVisible(Sint16 p_layer, bool p_visible);
	void setGridVisible(bool p_visible);

	void setName(std::string p_zoneName);
	std::string getName();
	Vector2<Uint16> getSize();

	Uint16 addWorldObject(Uint8 p_layer, WorldObject p_object);
	WorldObject& getWorldObject(Uint8 p_layer, Uint16 p_index);
	Uint16 getWorldObjectSize(Uint8 p_layer);
	void removeWorldObject(Uint8 p_layer, Uint16 p_index);

	void render(Vector2<Sint32> p_camPos);

	void save();
	void save(std::string p_zoneName);

	bool load();
	bool load(std::string p_zoneName);

	void createNew();
	
	void clear();
};
