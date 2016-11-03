#pragma once

#include "..\datatype\Texture.h"
#include "Manager.h"

class MTexture : public Manager<Texture>
{
public:
	Texture& findUnit(std::string p_unitName)
	{
		for(Uint32 i = 0; i < m_unitList.size(); i++)
		{
			if(m_unitList[i].getName() == p_unitName)
				return m_unitList[i];
		}
		return Texture();
	}
	Uint32 findUnitID(std::string p_unitName)
	{
		for(Uint32 i = 0; i < m_unitList.size(); i++)
		{
			if(m_unitList[i].getName() == p_unitName)
				return i;
		}
		return 0;
	}
};
