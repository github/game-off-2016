#pragma once

#include "engine\utils\variable\datatype\Color.h"
#include "engine\utils\variable\datatype\Rectangle.h"
#include "engine\utils\variable\datatype\Vector2.h"
#include "engine\utils\variable\datatype\Vector3.h"
#include "engine\utils\variable\datatype\Vector4.h"
#include "engine\utils\variable\datatype\Macros.h"
#include "engine\utils\OpenGL.h"
#include <sstream>
#include <stdlib.h>
#include <iostream>
#include <fstream>
#include <cstdint>
#include <list>
#include <vector>
#include <algorithm>

namespace Math
{
	static GLfloat round2f(GLfloat p_f, Sint32 p_decimalPlaces)
	{
		return GLfloat(roundf(p_f * GLfloat(pow(10, p_decimalPlaces))) / pow(10, p_decimalPlaces));
	}

	static GLfloat sind(GLfloat p_f) /* sin of decimal number */
	{
		return GLfloat(sin((double)(p_f * 3.14159265359 / 180)));
	}

	static GLfloat cosd(GLfloat p_f) /* cos of decimal number */
	{
		return GLfloat(cos((double)(p_f * 3.14159265359 / 180)));
	}

	static GLfloat tand(GLfloat p_f) /* tan of decimal number */
	{
		return GLfloat(tan((double)(p_f * 3.14159265359 / 180)));
	}

	static Vector3<GLfloat> computeDirection(Vector3<GLfloat> p_rotation)
	{
		GLfloat ydist = GLfloat(2 * sind(p_rotation.x));
		GLfloat xdist = GLfloat(sqrt(pow(2, 2) - pow(ydist, 2)));
		GLfloat zdist = GLfloat(xdist * sind(p_rotation.y));
		xdist = xdist * sind((p_rotation.y - 90));
		return Vector3<GLfloat>(zdist, ydist, xdist).getNormal();
	}

	static bool compf(GLfloat a, GLfloat b, GLfloat threshold = 0.00001f)
	{
		return (a + threshold > b && a - threshold < b);
	}
	//True if ccw, False if cw or not a triangle
	static bool orientation(const std::vector<Vector2<Sint32>>& p)
	{
		return ((p[1].x - p[0].x) * (p[2].y - p[0].y) -
			(p[2].x - p[0].x) * (p[1].y - p[0].y)) > 0;
	}
	static bool inTriangle(const Vector2<Sint32>& V, const Vector2<Sint32>& A,
		const Vector2<Sint32>& B, const Vector2<Sint32>& C)
	{
		GLfloat _denom = GLfloat((B.y - C.y) * (A.x - C.x) + (C.x - B.x) * (A.y - C.y));
		if(compf(_denom, 0.0f)) return true;
		_denom = 1 / _denom;

		GLfloat _alpha = _denom * ((B.y - C.y) * (V.x - C.x) + (C.x - B.x) * (V.y - C.y));
		if(_alpha < 0) return false;

		GLfloat _beta = _denom * ((C.y - A.y) * (V.x - C.x) + (A.x - C.x) * (V.y - C.y));
		if(_beta < 0) return false;

		return _alpha + _beta >= 1;
	}
	static std::vector<Uint16> triangulateIndex(std::vector<Vector2<Sint32>> p_polygon)
	{
		std::vector<Uint16> _reflex;
		std::vector<Uint16> _triangles;
		std::vector<Uint16> _indexList;
		for(Uint16 i = 0; i < p_polygon.size(); i++)
			_indexList.push_back(i);

		if(p_polygon.size() < 3)
		{
			_triangles.clear();
			for(Uint16 i = 0; i < p_polygon.size(); i++)
				_triangles.push_back(i);
			return _triangles;
		}

		Vector2<Sint32> _left = p_polygon[0];
		Sint32 index = 0;

		for(Sint32 i = 0; i < Sint32(p_polygon.size()); ++i)
		{
			if(p_polygon[i].x < _left.x ||
				(p_polygon[i].x == _left.x && p_polygon[i].y < _left.y))
			{
				index = i;
				_left = p_polygon[i];
			}
		}

		std::vector<Vector2<Sint32>> _tri;
		_tri.push_back(p_polygon[(index > 0) ? index - 1 : p_polygon.size() - 1]);
		_tri.push_back(p_polygon[index]);
		_tri.push_back(p_polygon[(index < Sint32(p_polygon.size()) - 1) ? index + 1 : 0]);
		bool ccw = orientation(_tri);

		_triangles.reserve(p_polygon.size() - 2);

		if(p_polygon.size() == 3)
		{
			_triangles.clear();
			for(Uint16 i = 0; i < p_polygon.size(); i++)
				_triangles.push_back(i);
			return _triangles;
		}
		while(p_polygon.size() >= 0)
		{
			_reflex.clear();
			Sint16 eartip = -1, index = -1;
			for(auto& i : p_polygon)
			{
				++index;
				if(eartip >= 0) break;

				Uint16 p = Uint16((index > 0) ? index - 1 : p_polygon.size() - 1);
				Uint16 n = Uint16((index < Sint16(p_polygon.size()) - 1) ? index + 1 : 0);

				std::vector<Vector2<Sint32>> tri{p_polygon[p], i, p_polygon[n]};
				if(orientation(tri) != ccw)
				{
					_reflex.emplace_back(index);
					continue;
				}

				bool ear = true;
				for(auto& j : _reflex)
				{
					if(j == p || j == n) continue;
					if(inTriangle(p_polygon[j], p_polygon[p], i, p_polygon[n]))
					{
						ear = false;
						break;
					}
				}

				if(ear)
				{
					auto j = p_polygon.begin() + index + 1,
						k = p_polygon.end();

					for(; j != k; ++j)
					{
						auto& v = *j;

						if(&v == &p_polygon[p] ||
							&v == &p_polygon[n] ||
							&v == &p_polygon[index]) continue;

						if(inTriangle(v, p_polygon[p], i, p_polygon[n]))
						{
							ear = false;
							break;
						}
					}
				}

				if(ear) eartip = index;
			}

			if(eartip < 0) break;

			Uint16 p = Uint16((eartip > 0) ? eartip - 1 : p_polygon.size() - 1);
			Uint16 n = Uint16((eartip < Sint16(p_polygon.size()) - 1) ? eartip + 1 : 0);
			Vector2<Sint32>* parts[3] = {
				&p_polygon[p], &p_polygon[eartip], &p_polygon[n]
			};
			_triangles.push_back(_indexList[p]);
			_triangles.push_back(_indexList[eartip]);
			_triangles.push_back(_indexList[n]);

			// Clip the ear from the polygon.
			p_polygon.erase(p_polygon.begin() + eartip);
			_indexList.erase(_indexList.begin() + eartip);
		}

		return _triangles;
	}
	static std::vector<Vector2<Sint32>> triangulate(std::vector<Vector2<Sint32>> p_polygon)
	{
		std::vector<Uint16> _reflex;
		std::vector<Vector2<Sint32>> _triangles;

		if(p_polygon.size() < 3) return p_polygon;

		Vector2<Sint32> _left = p_polygon[0];
		Sint32 index = 0;

		for(Sint32 i = 0; i < Sint32(p_polygon.size()); ++i)
		{
			if(p_polygon[i].x < _left.x ||
				(p_polygon[i].x == _left.x && p_polygon[i].y < _left.y))
			{
				index = i;
				_left = p_polygon[i];
			}
		}

		std::vector<Vector2<Sint32>> _tri;
		_tri.push_back(p_polygon[(index > 0) ? index - 1 : p_polygon.size() - 1]);
		_tri.push_back(p_polygon[index]);
		_tri.push_back(p_polygon[(index < Sint32(p_polygon.size()) - 1) ? index + 1 : 0]);
		bool ccw = orientation(_tri);

		_triangles.reserve(p_polygon.size() - 2);

		if(p_polygon.size() == 3) return p_polygon;
		while(p_polygon.size() >= 0)
		{
			_reflex.clear();
			Sint16 eartip = -1, index = -1;
			for(auto& i : p_polygon)
			{
				++index;
				if(eartip >= 0) break;

				Uint16 p = Uint16((index > 0) ? index - 1 : p_polygon.size() - 1);
				Uint16 n = Uint16((index < Sint16(p_polygon.size()) - 1) ? index + 1 : 0);
				
				std::vector<Vector2<Sint32>> tri{p_polygon[p], i, p_polygon[n]};
				if(orientation(tri) != ccw)
				{
					_reflex.emplace_back(index);
					continue;
				}

				bool ear = true;
				for(auto& j : _reflex)
				{
					if(j == p || j == n) continue;
					if(inTriangle(p_polygon[j], p_polygon[p], i, p_polygon[n]))
					{
						ear = false;
						break;
					}
				}

				if(ear)
				{
					auto j = p_polygon.begin() + index + 1,
						k = p_polygon.end();

					for(; j != k; ++j)
					{
						auto& v = *j;

						if(&v == &p_polygon[p] ||
							&v == &p_polygon[n] ||
							&v == &p_polygon[index]) continue;

						if(inTriangle(v, p_polygon[p], i, p_polygon[n]))
						{
							ear = false;
							break;
						}
					}
				}

				if(ear) eartip = index;
			}

			if(eartip < 0) break;

			Uint16 p = Uint16((eartip > 0) ? eartip - 1 : p_polygon.size() - 1);
			Uint16 n = Uint16((eartip < Sint16(p_polygon.size()) - 1) ? eartip + 1 : 0);
			Vector2<Sint32>* parts[3] = {
				&p_polygon[p], &p_polygon[eartip], &p_polygon[n]
			};

			// Create the triangulated piece.
			for(const auto& i : parts) _triangles.push_back(*i);

			// Clip the ear from the polygon.
			p_polygon.erase(std::find(p_polygon.begin(), p_polygon.end(), *parts[1]));
		}

		return _triangles;
	}
};

class Util
{
public:
	template<class T>
	static std::string numToString(T n, Uint16 p_decimalPlaces = 0)
	{
		try
		{
			return std::string(std::to_string(n)).substr(0, std::string(std::to_string(n)).find('.', 0) + p_decimalPlaces + (p_decimalPlaces > 0 ? 1 : 0));
		}
		catch(...) {
			std::cout << "Warning: Arg passed to Util::numToString( T n ) was not a number." << std::endl;;
		}
		return "0";
	}

	template< class T >
	static std::string stringToNum(T s)
	{
		std::string save = "";
		std::ostringstream convert;
		convert.str(std::string());
		try {
			convert << s;
			save = convert.str();
			return save;
		}
		catch(std::exception e) {
			return std::string("Incorrect Variable Type!");
		}
	}

	static std::string subchar(char* chararray, Uint32 start, Uint32 end)
	{
		std::string subbed;
		for(Uint32 i = start; i < end + 1; i++)
		{
			subbed += chararray[i];
		}
		return subbed;
	}

};

class FileExt
{
public:
	static void writeInt(std::ofstream& p_fileStream, Sint32 p_uint)
	{
		std::cout << p_uint << " ";
		p_fileStream << Uint8((p_uint & 0xFF000000) >> 24);
		p_fileStream << Uint8((p_uint & 0xFF0000) >> 16);
		p_fileStream << Uint8((p_uint & 0xFF00) >> 8);
		p_fileStream << Uint8((p_uint & 0xFF));
		std::cout << Sint16((p_uint & 0xFF000000) >> 24) << " " << Sint16((p_uint & 0xFF0000) >> 16) << " " << Sint16((p_uint & 0xFF00) >> 8) << " " << Sint16((p_uint & 0xFF)) << std::endl;
	}
	static void writeShort(std::ofstream& p_fileStream, Sint16 p_ushort)
	{
		p_fileStream << Uint8((p_ushort & 0xFF00) >> 8);
		p_fileStream << Uint8((p_ushort & 0xFF));
	}
	static void writeChar(std::ofstream& p_fileStream, Sint8 p_uchar)
	{
		p_fileStream << p_uchar;
	}

	static Sint32 readInt(char* p_fileStream, Uint32& p_index)
	{
		Sint32 _value;
		_value = readChar(p_fileStream, p_index) << 24;
		_value += readChar(p_fileStream, p_index) << 16;
		_value += readChar(p_fileStream, p_index) << 8;
		_value += readChar(p_fileStream, p_index);
		return _value;
	}
	static Sint16 readShort(char* p_fileStream, Uint32& p_index)
	{
		Sint16 _value;
		_value = readChar(p_fileStream, p_index) << 8;
		_value += readChar(p_fileStream, p_index);
		return _value;
	}
	static Uint8 readChar(char* p_fileStream, Uint32& p_index)
	{
		p_index = p_index + 1;
		return Uint8(p_fileStream[p_index - 1]);
	}
};
