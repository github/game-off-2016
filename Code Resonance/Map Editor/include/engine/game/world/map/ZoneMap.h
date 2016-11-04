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
		Uint16 m_texture;
		Vector2<Sint32> m_pos; // lowest x and lowest y values of vertices
		Vector2<Sint32> m_size; // difference of highest x and y with lowest x and y
		std::vector<Vector2<Sint32>> m_vertices;
		std::vector<Vector2<Sint32>> m_triangles;

		WorldObject(std::string p_name, Uint16 p_interactionType)
		{
			m_name = p_name;
			m_interactionType = p_interactionType;
		}

		void addVertex(Vector2<Sint32> p_vertex)
		{
			m_vertices.push_back(p_vertex);
			if(m_vertices.size() > 2)
			{
				m_triangles = Math::triangulate(m_vertices);
			}

			m_pos = m_vertices[0];
			Vector2<Sint32> m_max = m_vertices[0];

			for(Uint16 i = 1; i < m_vertices.size(); i++)
			{
				m_pos.x = min(m_pos.x, m_vertices[i].x);
				m_pos.y = min(m_pos.y, m_vertices[i].y);
				m_max.x = max(m_max.x, m_vertices[i].x);
				m_max.y = max(m_max.y, m_vertices[i].y);
			}
			m_size = m_max - m_pos;
		}

		void deleteVertex(Uint16 p_index)
		{
			m_vertices.erase(m_vertices.begin() + p_index);
			if(m_vertices.size() > 2)
			{
				m_triangles = Math::triangulate(m_vertices);

				m_pos = m_vertices[0];
				Vector2<Sint32> m_max = m_vertices[0];

				for(Uint16 i = 1; i < m_vertices.size(); i++)
				{
					m_pos.x = min(m_pos.x, m_vertices[i].x);
					m_pos.y = min(m_pos.y, m_vertices[i].y);
					m_max.x = max(m_max.x, m_vertices[i].x);
					m_max.y = max(m_max.y, m_vertices[i].y);
				}
				m_size = m_max - m_pos;
			}
			else
				m_triangles.clear();
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

	Sint16 m_selected[3];

	std::vector<Texture> m_textures;

public:
	ZoneMap();
	~ZoneMap();

	Uint16 addTexture(Texture);
	Texture getTexture(Uint16);

	void setViewSize(Rect p_viewSize);
	void setLayerVisible(Sint16 p_layer, bool p_visible);
	void setGridVisible(bool p_visible);

	void setName(std::string p_zoneName);
	std::string getName();
	Vector2<Uint16> getSize();

	void addVertex(Vector2<Sint32>);
	bool objectIsSelected();
	void deselect();
	void deleteVertex();
	Uint16 addWorldObject(Uint8 p_layer, WorldObject p_object, Texture p_texture);
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
