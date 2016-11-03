#pragma once
#include "Vector2.h"
#include "Macros.h"

#include <string>

struct Texture
{
private:
	Sint32 m_texId;
	std::string m_name;
	Vector2<Sint32> m_size;

public:
	Texture( std::string p_name = "", Sint32 p_texId = -1, Vector2<Sint32> p_size = {} )
	{
		m_texId = p_texId;
		m_name = p_name;
		m_size = p_size;
	}
	bool operator==( Texture p_tex )
	{
		return ( m_name == p_tex.m_name && m_size.x == p_tex.m_size.x && m_size.y == p_tex.m_size.y );
	}
	void setName(std::string p_name)
	{
		m_name = p_name;
	}
	Sint32 getId()
	{
		return m_texId;
	}
	std::string getName()
	{
		return m_name;
	}
	Vector2<Sint32> getSize()
	{
		return m_size;
	}
};
