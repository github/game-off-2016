#pragma once
#include "..\..\Singleton.h"
#include "..\..\Utilities.h"
#include <vector>

template< class T >
class Manager : public Singleton< Manager< T > >
{
public:
	Manager()
	{

	};
	Manager(const Manager&) {};
	Manager operator=(const Manager&) {};

	Uint32 addUnit(T& p_unit)
	{
		m_unitList.push_back(p_unit);
		return m_unitList.size() - 1;
	}

	bool contains(T& p_unit)
	{
		for(Uint32 i = 0; i < m_unitList.size(); i++)
			if(p_unit == m_unitList[i])
				return true;
		return false;
	}

	T& getUnit(Uint32 p_guid)
	{
		return m_unitList.at(p_guid);
	}

	std::vector< T > getUnitList()
	{
		return m_unitList;
	}

	Uint32 getUnitID(T& p_unit)
	{
		for(Uint32 i = 0; i < m_unitList.size(); i++)
			if(p_unit == m_unitList[i])
				return i;
		return addUnit(p_unit);
	}

protected:
	std::vector< T > m_unitList;
};




template< class T >
class ManagerEntity : public Singleton< ManagerEntity< T > >
{
public:
	ManagerEntity()
	{

	}
	Uint16 addUnit(T& p_unit)
	{
		m_unitList.push_back(p_unit);
		return Uint16(m_unitList.size());
	}
	virtual void update(Vector3< GLfloat > pos, GLfloat radius, GLfloat p_updateTime)
	{
		for(Uint16 i = 0; i < Uint16(m_unitList.size()); i++)
		{
			//m_unitList[i].update();
		}
	};
	virtual void render(Vector3< GLfloat > pos, GLfloat radius, GLfloat p_updateTime)
	{
		for(Uint16 i = 0; i < Uint16(m_unitList.size()); i++)
		{
			//m_unitList[i].render();
		}
	};
	T& getUnit(Uint16 guid)
	{
		return m_unitList[guid - 1];
	}
protected:
	std::vector< T > m_unitList;
};
