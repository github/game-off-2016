#pragma once
#include "Vector4.h"
#include "engine\utils\OpenGL.h"
#include <stdlib.h>
#include <math.h>

struct Color
{
	unsigned char r, g, b, a;

	Color( unsigned char r = 0, unsigned char g = 0, unsigned char b = 0, unsigned char a = 0 )
	{
		this->r = r;
		this->g = g;
		this->b = b;
		this->a = a;
	}

	void useColor( GLfloat p_mod = 1.f )
	{
		glColor4f( GLfloat( r ) / 255.f * p_mod, GLfloat( g ) / 255.f * p_mod, GLfloat( b ) / 255.f * p_mod, GLfloat( a ) / 255.f );
	}

	Vector4< GLfloat > normalize()
	{
		return Vector4< GLfloat >
		{
			GLfloat( r ) / 255.f, GLfloat( g ) / 255.f, GLfloat( b ) / 255.f, GLfloat( a ) / 255.f
		};
	}

	void operator=( Color color )
	{
		r = color.r;
		g = color.g;
		b = color.b;
		a = color.a;
	}

	unsigned char sub( int a, int b )
	{
		return unsigned char( fmax( a - b, 0 ) );
	}
	
	unsigned char add( int a, int b )
	{
		return unsigned char( fmin( a + b, 255 ) );
	}

	Color operator/( GLfloat value )
	{
		return Color( unsigned char( GLfloat( r ) / value ),
			unsigned char( GLfloat( g ) / value ),
			unsigned char( GLfloat( b ) / value ),
			a );
	}

	void operator/=( float value )
	{
		r = unsigned char( float( r ) / value );
		g = unsigned char( float( g ) / value );
		b = unsigned char( float( b ) / value );
	}

	Color operator*( float v )
	{
		return Color( unsigned char( r * v ), unsigned char( g * v ), unsigned char( b * v ), a );
	}

	Color operator+( Color c )
	{
			return Color( c.r >= 0 ? add( r, c.r ) : sub( r, c.r ), c.g >= 0 ? add( g, c.g ) : sub( g, c.g ), c.b >= 0 ? add( b, c.b ) : sub( b, c.b ), c.a >= 0 ? add( a, c.a ) : sub( a, c.a ) );
	}
	Color operator+( unsigned char v )
	{
		if( v >= 0 )
			return Color( add( r, v ), add( g, v), add( b, v ), a );
		else
			return Color( sub( r, v ), sub( g, v), sub( b, v ), a );
	}

	Color operator-( int v )
	{
		if( v >= 0 )
			return Color( sub( r, v ), sub( g, v), sub( b, v ), a );
		else
			return Color( add( r, v ), add( g, v), add( b, v ), a );
	}

	bool operator==( Color c ) const
	{ return ( r == c.r && g == c.g && b == c.b && a == c.a ); }
};
