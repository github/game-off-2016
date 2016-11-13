#include "engine\game\world\map\ZoneMap.h"
#include "engine\utils\Globals.h"

#include <direct.h>
#include <fstream>

ZoneMap::ZoneMap()
{
	m_selected[0] = -1;
	m_selected[1] = -1;
	m_selected[2] = -1;
	m_highlight[0] = -1;
	m_highlight[1] = -1;
	m_highlight[2] = -1;
	m_heldVertex = -1;
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


void ZoneMap::addVertex(Vector2<Sint32> p_vertex)
{
	if(m_selected[2] > 0)
		m_worldObjects[m_selected[0]][m_selected[1]].insertVertex(p_vertex, m_selected[2] + 1);
	else
		m_worldObjects[m_selected[0]][m_selected[1]].addVertex(p_vertex);
	m_selected[2] = min(m_selected[2] + 1, Sint16(m_worldObjects[m_selected[0]][m_selected[1]].m_vertices.size() - 1));
	m_heldVertex = m_selected[2];
}
bool ZoneMap::objectIsSelected()
{
	return (m_selected[0] != -1 && m_selected[1] != -1);
}
Sint16 ZoneMap::grabVertex(Vector2<Sint32> p_mouse)
{
	Sint16 _selected = -1;
	Sint16 _curr, _close = 8;
	if(objectIsSelected())
	{
		for(Uint16 i = 0; i < m_worldObjects[m_selected[0]][m_selected[1]].m_vertices.size(); i++)
		{
			_curr = Sint16((m_worldObjects[m_selected[0]][m_selected[1]].m_vertices[i] - p_mouse).getLength());
			if((m_worldObjects[m_selected[0]][m_selected[1]].m_vertices[i] - p_mouse).getLength() < _close)
			{
				_selected = i;
				_close = _curr;
			}
		}
	}
	m_heldVertex = _selected;
	if(_selected != -1)
		m_selected[2] = _selected;
	return _selected;
}
void ZoneMap::releaseVertex()
{
	m_heldVertex = -1;
}
Sint16 ZoneMap::highlightObject(Sint8 p_layer, Vector2<Sint32> p_point)
{
	Vector2<Sint32> v0, v1, v2;
	Vector2<Sint32> vA, vB, vC;
	GLfloat dot00, dot01, dot02, dot11, dot12;
	GLfloat u, v;
	GLfloat invDenom;

	if(m_heldVertex != -1)
	{
		m_highlight[0] = m_selected[0];
		m_highlight[1] = m_selected[1];
		m_highlight[2] = m_selected[2];
	}

	for(Uint16 i = 0; i < m_worldObjects[p_layer].size(); i++)
	{
		for(Uint16 j = 0; j < m_worldObjects[p_layer][i].m_triangles.size() / 3; j++)
		{
			vA = m_worldObjects[p_layer][i].m_vertices[m_worldObjects[p_layer][i].m_triangles[j * 3 + 1]];
			vB = m_worldObjects[p_layer][i].m_vertices[m_worldObjects[p_layer][i].m_triangles[j * 3 + 0]];
			vC = m_worldObjects[p_layer][i].m_vertices[m_worldObjects[p_layer][i].m_triangles[j * 3 + 2]];

			v0 = vC - vA;
			v1 = vB - vA;
			v2 = p_point - vA;

			dot00 = v0.dot(v0);
			dot01 = v0.dot(v1);
			dot02 = v0.dot(v2);
			dot11 = v1.dot(v1);
			dot12 = v1.dot(v2);

			invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
			u = (dot11 * dot02 - dot01 * dot12) * invDenom;
			v = (dot00 * dot12 - dot01 * dot02) * invDenom;

			if(u >= 0 && v >= 0 && (u + v < 1))
			{
				m_highlight[0] = p_layer;
				m_highlight[1] = i;
				m_highlight[2] = j;
				return i;
			}
		}
	}
	m_highlight[0] = -1;
	m_highlight[1] = -1;
	m_highlight[2] = -1;
	return -1;
}
bool ZoneMap::selectObject(Sint8 p_layer, Vector2<Sint32> p_point)
{
	Vector2<Sint32> v0, v1, v2;
	Vector2<Sint32> vA, vB, vC;
	GLfloat dot00, dot01, dot02, dot11, dot12;
	GLfloat u, v;
	GLfloat invDenom;
	for(Uint16 i = 0; i < m_worldObjects[p_layer].size(); i++)
	{
		for(Uint16 j = 0; j < m_worldObjects[p_layer][i].m_triangles.size() / 3; j++)
		{
			vA = m_worldObjects[p_layer][i].m_vertices[m_worldObjects[p_layer][i].m_triangles[j * 3 + 1]];
			vB = m_worldObjects[p_layer][i].m_vertices[m_worldObjects[p_layer][i].m_triangles[j * 3 + 0]];
			vC = m_worldObjects[p_layer][i].m_vertices[m_worldObjects[p_layer][i].m_triangles[j * 3 + 2]];

			v0 = vC - vA;
			v1 = vB - vA;
			v2 = p_point - vA;

			dot00 = v0.dot(v0);
			dot01 = v0.dot(v1);
			dot02 = v0.dot(v2);
			dot11 = v1.dot(v1);
			dot12 = v1.dot(v2);

			invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
			u = (dot11 * dot02 - dot01 * dot12) * invDenom;
			v = (dot00 * dot12 - dot01 * dot02) * invDenom;

			if(u >= 0 && v >= 0 && (u + v < 1))
			{
				m_selected[0] = p_layer;
				m_selected[1] = i;
				if((p_point - vA).getLength() < (p_point - vB).getLength())
				{
					if((p_point - vA).getLength() < (p_point - vC).getLength())
						m_selected[2] = m_worldObjects[p_layer][i].m_triangles[j * 3 + 1];
					else
						m_selected[2] = m_worldObjects[p_layer][i].m_triangles[j * 3 + 2];
				}
				else
				{
					if((p_point - vB).getLength() < (p_point - vC).getLength())
						m_selected[2] = m_worldObjects[p_layer][i].m_triangles[j * 3 + 0];
					else
						m_selected[2] = m_worldObjects[p_layer][i].m_triangles[j * 3 + 2];
				}
				return true;
			}
		}
	}
	return false;
}
void ZoneMap::deselect()
{
	m_selected[0] = -1; m_selected[1] = -1; m_selected[2] = -1;
	m_heldVertex = -1;
}
void ZoneMap::deleteVertex()
{
	if(m_selected[0] >= 0 && m_selected[1] >= 0 && m_selected[2] >= 0)
	{
		m_worldObjects[m_selected[0]][m_selected[1]].deleteVertex(m_selected[2]);
		m_selected[2]--;
		if(m_selected[2] < 0)
		{
			if(m_worldObjects[m_selected[0]][m_selected[1]].m_vertices.empty())
			{
				m_worldObjects[m_selected[0]].erase(m_worldObjects[m_selected[0]].begin() + m_selected[1]);
				deselect();
			}
			else
				m_selected[2] = 0;
		}
	}
}
Uint16 ZoneMap::addWorldObject(Uint8 p_layer, WorldObject p_object, Texture p_texture)
{
	m_worldObjects[p_layer].push_back(p_object);
	m_selected[0] = p_layer;
	m_selected[1] = Sint16(m_worldObjects[p_layer].size() - 1);
	m_selected[2] = 0;

	Uint16 i;
	for(i = 0; i < m_textures.size(); i++)
	{
		if(m_textures[i] == p_texture)
			goto a;
	}
	m_textures.push_back(p_texture);

a:
	m_worldObjects[p_layer][m_worldObjects[p_layer].size() - 1].m_texture = i;
	return Uint16(m_worldObjects[p_layer].size());
}
ZoneMap::WorldObject& ZoneMap::getWorldObject(Uint8 p_layer, Uint16 p_index)
{
	return m_worldObjects[p_layer][p_index];
}
ZoneMap::WorldObject& ZoneMap::getSelectedWorldObject()
{
	if(objectIsSelected())
		return m_worldObjects[m_selected[0]][m_selected[1]];
	return WorldObject("", 0, false);
}
Uint16 ZoneMap::getWorldObjectSize(Uint8 p_layer)
{
	return Uint16(m_worldObjects[p_layer].size());
}
void ZoneMap::removeWorldObject(Uint8 p_layer, Uint16 p_index)
{
	m_worldObjects[p_layer].erase(m_worldObjects[p_layer].begin() + p_index);
}

void ZoneMap::update(Vector2<Sint32> p_mousePos)
{
	if(objectIsSelected() && m_heldVertex != -1)
	{
		m_worldObjects[m_selected[0]][m_selected[1]].moveVertex(m_heldVertex, p_mousePos);
	}
}
#include <stdlib.h>
void ZoneMap::render(Vector2<Sint32> p_camPos)
{
	Vector2<Sint32> _texOffset;
	glPushMatrix();
	{
		glScalef(Globals::getInstance().m_zoom, Globals::getInstance().m_zoom, 1);
		glPushMatrix();
		{
			glTranslatef(-GLfloat(p_camPos.x), -GLfloat(p_camPos.y), 0);

			if(m_layerVisible[0])
			{
				for(Uint16 i = 0; i < m_worldObjects[0].size(); i++)
				{
					// Offset value to subract back to origin
					if(!m_worldObjects[0][i].m_texOffset)
						_texOffset = {};
					else
						_texOffset = m_worldObjects[0][i].m_vertices[0];
					glBindTexture(GL_TEXTURE_2D, m_textures[m_worldObjects[0][i].m_texture].getId());
					glColor3f(0.8f, 0.8f, 0.8f);
					glBegin(GL_TRIANGLES);
					{
						for(Uint16 j = 0; j < m_worldObjects[0][i].m_triangles.size(); j++)
						{
							if(j < m_worldObjects[0][i].m_triangles.size())
							{
								glTexCoord2f(GLfloat(m_worldObjects[0][i].m_vertices[m_worldObjects[0][i].m_triangles[j]].x - _texOffset.x) / m_textures[m_worldObjects[0][i].m_texture].getSize().x,
									GLfloat(m_worldObjects[0][i].m_vertices[m_worldObjects[0][i].m_triangles[j]].y - _texOffset.y) / m_textures[m_worldObjects[0][i].m_texture].getSize().y);
								glVertex2f(GLfloat(m_worldObjects[0][i].m_vertices[m_worldObjects[0][i].m_triangles[j]].x), GLfloat(m_worldObjects[0][i].m_vertices[m_worldObjects[0][i].m_triangles[j]].y));
							}
						}
						if(m_highlight[0] == 0 && m_highlight[1] == i)
						{
							glBindTexture(GL_TEXTURE_2D, 0);
							glColor4f(1.f, 1.f, 1.f, 0.5f);
							for(Uint16 j = 0; j < m_worldObjects[0][i].m_triangles.size(); j++)
							{
								if(j < m_worldObjects[0][i].m_triangles.size())
								{
									glVertex2f(GLfloat(m_worldObjects[0][i].m_vertices[m_worldObjects[0][i].m_triangles[j]].x), GLfloat(m_worldObjects[0][i].m_vertices[m_worldObjects[0][i].m_triangles[j]].y));
								}
							}
						}
					}
					glEnd();
					glBindTexture(GL_TEXTURE_2D, 0);
					glColor3f(0, 0, 0);
					glBegin(GL_LINES);
					{
						for(Uint16 j = 0; j < m_worldObjects[0][i].m_vertices.size(); j++)
						{
							if(j + 1 < Uint16(m_worldObjects[0][i].m_vertices.size()))
							{
								glVertex2f(GLfloat(m_worldObjects[0][i].m_vertices[j].x), GLfloat(m_worldObjects[0][i].m_vertices[j].y));
								glVertex2f(GLfloat(m_worldObjects[0][i].m_vertices[j + 1].x), GLfloat(m_worldObjects[0][i].m_vertices[j + 1].y));
							}
							else
							{
								glVertex2f(GLfloat(m_worldObjects[0][i].m_vertices[j].x), GLfloat(m_worldObjects[0][i].m_vertices[j].y));
								glVertex2f(GLfloat(m_worldObjects[0][i].m_vertices[0].x), GLfloat(m_worldObjects[0][i].m_vertices[0].y));
							}
						}
					}
					glEnd();

					glColor3f(1, 0, 0);
					glBegin(GL_QUADS);
					Vector2<Sint32> v;
					for(Uint16 j = 0; j < m_worldObjects[0][i].m_vertices.size(); j++)
					{
						v = m_worldObjects[0][i].m_vertices[j];
						glVertex2f(GLfloat(v.x - 2), GLfloat(v.y - 2));
						glVertex2f(GLfloat(v.x + 2), GLfloat(v.y - 2));
						glVertex2f(GLfloat(v.x + 2), GLfloat(v.y + 2));
						glVertex2f(GLfloat(v.x - 2), GLfloat(v.y + 2));
					}
					glEnd();
				}

				if(m_selected[0] == 0 && m_selected[1] >= 0 && m_selected[2] >= 0)
				{
					Vector2<Sint32> v = m_worldObjects[0][m_selected[1]].m_vertices[m_selected[2]];
					Vector2<Sint32> vn;
					if(m_selected[2] == m_worldObjects[m_selected[0]][m_selected[1]].m_vertices.size() - 1)
						vn = m_worldObjects[m_selected[0]][m_selected[1]].m_vertices[0];
					else
						vn = m_worldObjects[m_selected[0]][m_selected[1]].m_vertices[m_selected[2] + 1];
					glColor3f(0, 1, 0);
					glBegin(GL_LINES);
					{
						glVertex2f(GLfloat(v.x), GLfloat(v.y));
						glVertex2f(GLfloat(vn.x), GLfloat(vn.y));
					}
					glEnd();
					glBegin(GL_QUADS);
					{
						glVertex2f(GLfloat(v.x - 2), GLfloat(v.y - 2));
						glVertex2f(GLfloat(v.x + 2), GLfloat(v.y - 2));
						glVertex2f(GLfloat(v.x + 2), GLfloat(v.y + 2));
						glVertex2f(GLfloat(v.x - 2), GLfloat(v.y + 2));
					}
					glEnd();
				}
			}



			if(m_layerVisible[1])
			{
				for(Uint16 i = 0; i < m_worldObjects[1].size(); i++)
				{
					if(!m_worldObjects[1][i].m_texOffset)
						_texOffset = {};
					else
						_texOffset = m_worldObjects[1][i].m_vertices[0];
					glBindTexture(GL_TEXTURE_2D, m_textures[m_worldObjects[1][i].m_texture].getId());
					glColor3f(1, 1, 1);
					glBegin(GL_TRIANGLES);
					{
						for(Uint16 j = 0; j < m_worldObjects[1][i].m_triangles.size(); j++)
						{
							if(j < m_worldObjects[1][i].m_triangles.size())
							{
								glTexCoord2f(GLfloat(m_worldObjects[1][i].m_vertices[m_worldObjects[1][i].m_triangles[j]].x - _texOffset.x) / m_textures[m_worldObjects[1][i].m_texture].getSize().x,
									GLfloat(m_worldObjects[1][i].m_vertices[m_worldObjects[1][i].m_triangles[j]].y - _texOffset.y) / m_textures[m_worldObjects[1][i].m_texture].getSize().y);
								glVertex2f(GLfloat(m_worldObjects[1][i].m_vertices[m_worldObjects[1][i].m_triangles[j]].x), GLfloat(m_worldObjects[1][i].m_vertices[m_worldObjects[1][i].m_triangles[j]].y));
							}
						}
						if(m_highlight[0] == 1 && m_highlight[1] == i)
						{
							glBindTexture(GL_TEXTURE_2D, 0);
							glColor4f(1.f, 1.f, 1.f, 0.5f);
							for(Uint16 j = 0; j < m_worldObjects[1][i].m_triangles.size(); j++)
							{
								if(j < m_worldObjects[1][i].m_triangles.size())
								{
									glVertex2f(GLfloat(m_worldObjects[1][i].m_vertices[m_worldObjects[1][i].m_triangles[j]].x), GLfloat(m_worldObjects[1][i].m_vertices[m_worldObjects[1][i].m_triangles[j]].y));
								}
							}
						}
					}
					glEnd();
					glBindTexture(GL_TEXTURE_2D, 0);
					glColor3f(0, 0, 0);
					glBegin(GL_LINES);
					{
						for(Uint16 j = 0; j < m_worldObjects[1][i].m_vertices.size(); j++)
						{
							if(j + 1 < Uint16(m_worldObjects[1][i].m_vertices.size()))
							{
								glVertex2f(GLfloat(m_worldObjects[1][i].m_vertices[j].x), GLfloat(m_worldObjects[1][i].m_vertices[j].y));
								glVertex2f(GLfloat(m_worldObjects[1][i].m_vertices[j + 1].x), GLfloat(m_worldObjects[1][i].m_vertices[j + 1].y));
							}
							else
							{
								glVertex2f(GLfloat(m_worldObjects[1][i].m_vertices[j].x), GLfloat(m_worldObjects[1][i].m_vertices[j].y));
								glVertex2f(GLfloat(m_worldObjects[1][i].m_vertices[0].x), GLfloat(m_worldObjects[1][i].m_vertices[0].y));
							}
						}
					}
					glEnd();

					glColor3f(1, 0, 0);
					glBegin(GL_QUADS);
					Vector2<Sint32> v;
					for(Uint16 j = 0; j < m_worldObjects[1][i].m_vertices.size(); j++)
					{
						v = m_worldObjects[1][i].m_vertices[j];
						glVertex2f(GLfloat(v.x - 2), GLfloat(v.y - 2));
						glVertex2f(GLfloat(v.x + 2), GLfloat(v.y - 2));
						glVertex2f(GLfloat(v.x + 2), GLfloat(v.y + 2));
						glVertex2f(GLfloat(v.x - 2), GLfloat(v.y + 2));
					}
					glEnd();
				}

				if(m_selected[0] == 1 && m_selected[1] >= 0 && m_selected[2] >= 0)
				{
					Vector2<Sint32> v = m_worldObjects[m_selected[0]][m_selected[1]].m_vertices[m_selected[2]];
					Vector2<Sint32> vn;
					if(m_selected[2] == m_worldObjects[m_selected[0]][m_selected[1]].m_vertices.size() - 1)
						vn = m_worldObjects[m_selected[0]][m_selected[1]].m_vertices[0];
					else
						vn = m_worldObjects[m_selected[0]][m_selected[1]].m_vertices[m_selected[2] + 1];
					glColor3f(0, 1, 0);
					glBegin(GL_LINES);
					{
						glVertex2f(GLfloat(v.x), GLfloat(v.y));
						glVertex2f(GLfloat(vn.x), GLfloat(vn.y));
					}
					glEnd();
					glBegin(GL_QUADS);
					{
						glVertex2f(GLfloat(v.x - 2), GLfloat(v.y - 2));
						glVertex2f(GLfloat(v.x + 2), GLfloat(v.y - 2));
						glVertex2f(GLfloat(v.x + 2), GLfloat(v.y + 2));
						glVertex2f(GLfloat(v.x - 2), GLfloat(v.y + 2));
					}
					glEnd();
				}
			}



			if(m_layerVisible[2])
			{
				for(Uint16 i = 0; i < m_worldObjects[2].size(); i++)
				{
					if(!m_worldObjects[2][i].m_texOffset)
						_texOffset = {};
					else
						_texOffset = m_worldObjects[2][i].m_vertices[0];
					glBindTexture(GL_TEXTURE_2D, m_textures[m_worldObjects[2][i].m_texture].getId());
					glColor3f(0.8f, 0.8f, 0.8f);
					glBegin(GL_TRIANGLES);
					{
						for(Uint16 j = 0; j < m_worldObjects[2][i].m_triangles.size(); j++)
						{
							if(j < m_worldObjects[2][i].m_triangles.size())
							{
								glTexCoord2f(GLfloat(m_worldObjects[2][i].m_vertices[m_worldObjects[2][i].m_triangles[j]].x - _texOffset.x) / m_textures[m_worldObjects[2][i].m_texture].getSize().x,
									GLfloat(m_worldObjects[2][i].m_vertices[m_worldObjects[2][i].m_triangles[j]].y - _texOffset.y) / m_textures[m_worldObjects[2][i].m_texture].getSize().y);
								glVertex2f(GLfloat(m_worldObjects[2][i].m_vertices[m_worldObjects[2][i].m_triangles[j]].x), GLfloat(m_worldObjects[2][i].m_vertices[m_worldObjects[2][i].m_triangles[j]].y));
							}
						}
						if(m_highlight[0] == 2 && m_highlight[1] == i)
						{
							glBindTexture(GL_TEXTURE_2D, 0);
							glColor4f(1.f, 1.f, 1.f, 0.5f);
							for(Uint16 j = 0; j < m_worldObjects[2][i].m_triangles.size(); j++)
							{
								if(j < m_worldObjects[2][i].m_triangles.size())
								{
									glVertex2f(GLfloat(m_worldObjects[2][i].m_vertices[m_worldObjects[2][i].m_triangles[j]].x), GLfloat(m_worldObjects[2][i].m_vertices[m_worldObjects[2][i].m_triangles[j]].y));
								}
							}
						}
					}
					glEnd();
					glBindTexture(GL_TEXTURE_2D, 0);
					glColor3f(0, 0, 0);
					glBegin(GL_LINES);
					{
						for(Uint16 j = 0; j < m_worldObjects[2][i].m_vertices.size(); j++)
						{
							if(j + 1 < Uint16(m_worldObjects[2][i].m_vertices.size()))
							{
								glVertex2f(GLfloat(m_worldObjects[2][i].m_vertices[j].x), GLfloat(m_worldObjects[2][i].m_vertices[j].y));
								glVertex2f(GLfloat(m_worldObjects[2][i].m_vertices[j + 1].x), GLfloat(m_worldObjects[2][i].m_vertices[j + 1].y));
							}
							else
							{
								glVertex2f(GLfloat(m_worldObjects[2][i].m_vertices[j].x), GLfloat(m_worldObjects[2][i].m_vertices[j].y));
								glVertex2f(GLfloat(m_worldObjects[2][i].m_vertices[0].x), GLfloat(m_worldObjects[2][i].m_vertices[0].y));
							}
						}
					}
					glEnd();

					glColor3f(1, 0, 0);
					glBegin(GL_QUADS);
					Vector2<Sint32> v;
					for(Uint16 j = 0; j < m_worldObjects[2][i].m_vertices.size(); j++)
					{
						v = m_worldObjects[2][i].m_vertices[j];
						glVertex2f(GLfloat(v.x - 2), GLfloat(v.y - 2));
						glVertex2f(GLfloat(v.x + 2), GLfloat(v.y - 2));
						glVertex2f(GLfloat(v.x + 2), GLfloat(v.y + 2));
						glVertex2f(GLfloat(v.x - 2), GLfloat(v.y + 2));
					}
					glEnd();
				}

				if(m_selected[0] == 2 && m_selected[1] >= 0 && m_selected[2] >= 0)
				{
					Vector2<Sint32> v = m_worldObjects[m_selected[0]][m_selected[1]].m_vertices[m_selected[2]];
					Vector2<Sint32> vn;
					if(m_selected[2] == m_worldObjects[m_selected[0]][m_selected[1]].m_vertices.size() - 1)
						vn = m_worldObjects[m_selected[0]][m_selected[1]].m_vertices[0];
					else
						vn = m_worldObjects[m_selected[0]][m_selected[1]].m_vertices[m_selected[2] + 1];
					glColor3f(0, 1, 0);
					glBegin(GL_LINES);
					{
						glVertex2f(GLfloat(v.x), GLfloat(v.y));
						glVertex2f(GLfloat(vn.x), GLfloat(vn.y));
					}
					glEnd();
					glBegin(GL_QUADS);
					{
						glVertex2f(GLfloat(v.x - 2), GLfloat(v.y - 2));
						glVertex2f(GLfloat(v.x + 2), GLfloat(v.y - 2));
						glVertex2f(GLfloat(v.x + 2), GLfloat(v.y + 2));
						glVertex2f(GLfloat(v.x - 2), GLfloat(v.y + 2));
					}
					glEnd();
				}
			}

			glBindTexture(GL_TEXTURE_2D, 0);

			glColor3f(1, 0, 0);
			glBegin(GL_LINES);
			{
				glVertex2f(p_camPos.x - 2000, 0);
				glVertex2f(p_camPos.x + 2000, 0);
			}
			glEnd();

			glColor3f(0, 1, 0);
			glBegin(GL_LINES);
			{
				glVertex2f(0, p_camPos.y - 2000);
				glVertex2f(0, p_camPos.y + 2000);
			}
			glEnd();
		}
		glPopMatrix();

		if(m_grid)
		{
			Vector2<Sint32> _screen = Globals::getInstance().m_screenSize;
			glColor4f(0.75f, 0.75f, 0.75f, 0.5f);

			for(Sint32 x = -Sint32(_screen.x / Globals::getInstance().m_zoom / 2 - 1); x <= Sint32(_screen.x / Globals::getInstance().m_zoom / 2); x++)
			{
				glPushMatrix();
				{
					glTranslatef(GLfloat(fmod(-p_camPos.x + (p_camPos.x < 0 ? -1 : 0), 1) + (p_camPos.x < 0 ? 0 : 1)) + (p_camPos.x < 0 ? 1 : 0), 0, 0);
					glBegin(GL_LINES);
					{
						glVertex2f(GLfloat(x), -_screen.y / Globals::getInstance().m_zoom / 2);
						glVertex2f(GLfloat(x), _screen.y / Globals::getInstance().m_zoom / 2);
					}
					glEnd();
				}
				glPopMatrix();
			}
			for(Sint32 y = -Sint32(_screen.y / Globals::getInstance().m_zoom / 2 - 1); y <= Sint32(_screen.y / Globals::getInstance().m_zoom / 2); y++)
			{
				glPushMatrix();
				{
					glTranslatef(0, GLfloat(fmod(-p_camPos.y + (p_camPos.y < 0 ? -1 : 0), 1) + (p_camPos.y < 0 ? 0 : 1)) + (p_camPos.y < 0 ? 1 : 0), 0);
					glBegin(GL_LINES);
					{
						glVertex2f(-_screen.x / Globals::getInstance().m_zoom / 2, GLfloat(y));
						glVertex2f(_screen.x / Globals::getInstance().m_zoom / 2, GLfloat(y));
					}
					glEnd();
				}
				glPopMatrix();
			}
		}
	}
	glPopMatrix();
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
	_mkdir(std::string("maps\\").c_str());
	_mkdir(std::string("maps\\" + m_zoneName).c_str());
	_file.open(std::string("maps\\" + m_zoneName + "\\Data.crm"), std::ios::binary);
	{
		//Header

		//Name
		FileExt::writeChar(_file, Sint8(m_zoneName.length()));
		for(Sint16 i = 0; i < Sint16(m_zoneName.length()); i++)
			FileExt::writeChar(_file, m_zoneName[i]);
		//Texture
		FileExt::writeShort(_file, Sint16(m_textures.size()));
		for(Sint16 i = 0; i < Sint16(m_textures.size()); i++)
		{
			FileExt::writeChar(_file, Sint8(m_textures[i].getName().length()));
			for(Sint16 j = 0; j < Sint16(m_textures[i].getName().length()); j++)
				FileExt::writeChar(_file, m_textures[i].getName()[j]);
		}


		//Body

		//Background
		FileExt::writeInt(_file, Sint32(m_worldObjects[0].size()));
		for(Sint32 i = 0; i < Sint16(m_worldObjects[0].size()); i++)
		{
			FileExt::writeChar(_file, Sint8(m_worldObjects[0][i].m_texture));
			FileExt::writeChar(_file, Sint8(m_worldObjects[0][i].m_interactionType));
			FileExt::writeChar(_file, Sint8(m_worldObjects[0][i].m_texOffset));
			FileExt::writeShort(_file, Sint16(m_worldObjects[0][i].m_vertices.size()));
			for(Sint16 j = 0; j < Sint16(m_worldObjects[0][i].m_vertices.size()); j++)
			{
				FileExt::writeInt(_file, m_worldObjects[0][i].m_vertices[j].x);
				FileExt::writeInt(_file, m_worldObjects[0][i].m_vertices[j].y);
			}
		}

		//Middle
		FileExt::writeInt(_file, Sint32(m_worldObjects[1].size()));
		for(Sint32 i = 0; i < Sint16(m_worldObjects[1].size()); i++)
		{
			FileExt::writeChar(_file, Sint8(m_worldObjects[1][i].m_texture));
			FileExt::writeChar(_file, Sint8(m_worldObjects[1][i].m_interactionType));
			FileExt::writeChar(_file, Sint8(m_worldObjects[1][i].m_texOffset));
			FileExt::writeShort(_file, Sint16(m_worldObjects[1][i].m_vertices.size()));
			for(Sint16 j = 0; j < Sint16(m_worldObjects[1][i].m_vertices.size()); j++)
			{
				FileExt::writeInt(_file, m_worldObjects[1][i].m_vertices[j].x);
				FileExt::writeInt(_file, m_worldObjects[1][i].m_vertices[j].y);
			}
		}


		//Foreground
		FileExt::writeInt(_file, Sint32(m_worldObjects[2].size()));
		for(Sint32 i = 0; i < Sint16(m_worldObjects[2].size()); i++)
		{
			FileExt::writeChar(_file, Sint8(m_worldObjects[2][i].m_texture));
			FileExt::writeChar(_file, Sint8(m_worldObjects[2][i].m_interactionType));
			FileExt::writeChar(_file, Sint8(m_worldObjects[2][i].m_texOffset));
			FileExt::writeShort(_file, Sint16(m_worldObjects[2][i].m_vertices.size()));
			for(Sint16 j = 0; j < Sint16(m_worldObjects[2][i].m_vertices.size()); j++)
			{
				FileExt::writeInt(_file, m_worldObjects[2][i].m_vertices[j].x);
				FileExt::writeInt(_file, m_worldObjects[2][i].m_vertices[j].y);
			}
		}

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
	_file.open(std::string("maps\\" + p_zoneName + "\\Data.crm").c_str(), std::ios::binary);
	{
		if(!_file.good())
		{
			std::cout << "No Data.crm file found." << std::endl;
			return false;
		}

		clear();

		Uint32 _length, _index = 0;
		char* _data;

		_file.seekg(0, _file.end);
		_length = Uint32(_file.tellg());
		_file.seekg(0, _file.beg);
		_data = new char[_length];
		_file.read(_data, _length);

		//Header

		//Name
		m_zoneName = "";
		Sint32 _v1, _v2;
		_v1 = FileExt::readChar(_data, _index);
		for(Sint8 i = 0; i < _v1; i++)
			m_zoneName += FileExt::readChar(_data, _index);

		//Texture
		std::string _textureName;

		_v1 = FileExt::readShort(_data, _index);
		for(Sint16 i = 0; i < _v1; i++)
		{
			_textureName = "";
			_v2 = FileExt::readChar(_data, _index);
			for(Sint8 j = 0; j < _v2; j++)
			{
				_textureName += FileExt::readChar(_data, _index);
			}
			//Load texture
			m_textures.push_back(MTexture::getInstance().getUnit(LTexture::getInstance().loadImage(_textureName)));
		}

		//Body

		Sint8 _texOffset = 0;
		Sint8 _interactionType = 0;
		Sint8 _texture = 0;
		Sint32 x, y;

		//Background
		m_selected[0] = 0;
		_v1 = FileExt::readInt(_data, _index);
		for(Sint32 i = 0; i < _v1; i++)
		{
			_texture = FileExt::readChar(_data, _index);
			_interactionType = FileExt::readChar(_data, _index);
			_texOffset = FileExt::readChar(_data, _index);
			m_worldObjects[0].push_back(WorldObject("", _interactionType, (_texOffset == 1))); // TODO: m_guiLeftDetail->findComponent("BUTTON_TEXTURE_OFFSET")
			m_worldObjects[0][m_worldObjects[0].size() - 1].m_texture = _texture;
			m_selected[1] = i; m_selected[2] = 0;
			_v2 = FileExt::readShort(_data, _index);
			for(Sint16 j = 0; j < _v2; j++)
			{
				x = FileExt::readInt(_data, _index);
				y = FileExt::readInt(_data, _index);
				addVertex(Vector2<Sint32>(x, y));
			}
		}

		//Middle
		m_selected[0] = 1;
		_v1 = FileExt::readInt(_data, _index);
		for(Sint32 i = 0; i < _v1; i++)
		{
			_texture = FileExt::readChar(_data, _index);
			_interactionType = FileExt::readChar(_data, _index);
			_texOffset = FileExt::readChar(_data, _index);
			m_worldObjects[1].push_back(WorldObject("", _interactionType, (_texOffset == 1))); // TODO: m_guiLeftDetail->findComponent("BUTTON_TEXTURE_OFFSET")
			m_worldObjects[1][m_worldObjects[1].size() - 1].m_texture = _texture;
			m_selected[1] = i; m_selected[2] = 0;
			_v2 = FileExt::readShort(_data, _index);
			for(Sint16 j = 0; j < _v2; j++)
			{
				x = FileExt::readInt(_data, _index);
				y = FileExt::readInt(_data, _index);
				addVertex(Vector2<Sint32>(x, y));
			}
		}

		//Foreground
		m_selected[0] = 2;
		_v1 = FileExt::readInt(_data, _index);
		for(Sint32 i = 0; i < _v1; i++)
		{
			_texture = FileExt::readChar(_data, _index);
			_interactionType = FileExt::readChar(_data, _index);
			_texOffset = FileExt::readChar(_data, _index);
			m_worldObjects[2].push_back(WorldObject("", _interactionType, (_texOffset == 1))); // TODO: m_guiLeftDetail->findComponent("BUTTON_TEXTURE_OFFSET")
			m_worldObjects[2][m_worldObjects[2].size() - 1].m_texture = _texture;
			m_selected[1] = i; m_selected[2] = 0;
			_v2 = FileExt::readShort(_data, _index);
			for(Sint16 j = 0; j < _v2; j++)
			{
				x = FileExt::readInt(_data, _index);
				y = FileExt::readInt(_data, _index);
				addVertex(Vector2<Sint32>(x, y));
			}
		}

		m_selected[0] = -1; m_selected[1] = -1; m_selected[2] = -1;
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
	for(Sint8 i = 0; i < 3; i++)
	m_worldObjects[i].clear();
}
