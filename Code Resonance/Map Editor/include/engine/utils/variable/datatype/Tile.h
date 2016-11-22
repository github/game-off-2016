#pragma once

#include <string>

struct Tile
{
private:
	unsigned int m_tileTexIndex;
	unsigned char m_interactType;

public:
	Tile(unsigned int p_tileTexIndex, unsigned char p_interactType)
	{
		m_tileTexIndex = p_tileTexIndex;
		m_interactType = p_interactType;
	}

	unsigned int getTileTexIndex()
	{
		return m_tileTexIndex;
	}
	unsigned char getInteractType()
	{
		return m_interactType;
	}
};
