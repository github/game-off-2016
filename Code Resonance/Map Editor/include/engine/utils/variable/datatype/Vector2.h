#pragma once
#include <math.h>

template< typename T >
struct Vector2
{
	typedef float GLfloat;
	typedef unsigned short Uint16;

	T x, y;

	Vector2()
	{ x = y = 0; }

	Vector2( T p_x, T p_y ) :
	x( p_x ), y( p_y ) {}

	template< class C >
	Vector2< T >( Vector2< C > p_v )
	{
		x = T( p_v.x );
		y = T( p_v.y );
	}

	Vector2 operator+( T v ) const
	{ return Vector2< T >( x + v, y + v ); }
	Vector2 operator+( Vector2 v ) const
	{ return Vector2< T >( x + v.x, y + v.y ); }

	Vector2 operator-( T v ) const
	{ return Vector2< T >( x-v, y-v ); }
	Vector2 operator-( Vector2 v ) const
	{ return Vector2< T >( x - v.x, y - v.y ); }

	Vector2 operator/( T v ) const
	{ return Vector2< T >( x/v, y/v ); }
	Vector2 operator/( Vector2 v ) const
	{ return Vector2< T >( x / v.x, y / v.y ); }

	Vector2 operator*( T v ) const
	{ return Vector2< T >( x*v, y*v ); }
	Vector2 operator*( Vector2 v ) const
	{ return Vector2< T >( x*v.x, y*v.y ); }
	
	Vector2 operator%( Uint16 v ) const
	{ return Vector2< T >( fmod( x, v ), fmod( y, v ) ); }
	Vector2 operator%( Vector2< Uint16 > v ) const
	{ return Vector2< T >( fmod( x, v.x ), fmod( y, v.y ) ); }

	bool operator==( Vector2 v ) const
	{ return bool( x == v.x && y == v.y && z == v.z ); }

	Vector2< T > abs( GLfloat p_denominator = 1 )
	{ return Vector2< T >( fabsf( GLfloat( x ) / p_denominator, p_val ), fabsf( GLfloat( y ) / p_denominator, p_val ) ); }

	Vector2< T > floor( GLfloat p_denominator = 1 )
	{ return Vector2< T >( floorf( GLfloat( x ) / p_denominator, p_val ), floorf( GLfloat( y ) / p_denominator, p_val ) ); }

	Vector2< T > round( GLfloat p_denominator = 1 )
	{ return Vector2< T >( roundf( GLfloat( x ) / p_denominator, p_val ), roundf( GLfloat( y ) / p_denominator, p_val ) ); }

	Vector2< T > ceil( GLfloat p_denominator = 1 )
	{ return Vector2< T >( ceilf( GLfloat( x ) / p_denominator, p_val ), ceilf( GLfloat( y ) / p_denominator, p_val ) ); }

	Vector2< T > mod( T p_val )
	{ return Vector2< T >( modf( x, p_val ), modf( y, p_val ) ); }

	float getLength()
	{ return float( sqrt( x*x + y*y ) ); }
};
