#pragma once
#include <math.h>

template< class T >
struct Vector4
{
	typedef float GLfloat;
	typedef unsigned short Uint16;

	T x, y, z, w;

	Vector4< T >()
	{
		x = y = z = T( 0 );
	}

	Vector4< T >( T p_x, T p_y, T p_z, T p_w ) :
		x( p_x ), y( p_y ), z( p_z ), w( p_w ) {}

	template< class C >
	Vector4< T >( Vector4< C > p_v )
	{
		x = T( p_v.x );
		y = T( p_v.y );
		z = T( p_v.z );
		w = T( p_v.w );
	}

	Vector4< T > operator+( T v ) const
	{
		return Vector4< T >( x + v, y + v, z + v, w + v );
	}
	Vector4< T > operator+( Vector4 v ) const
	{
		return Vector4< T >( x + v.x, y + v.y, z + v.z, w + v.w );
	}

	Vector4< T > operator-( T v ) const
	{
		return Vector4< T >( x - v, y - v, z - v, w - v );
	}
	Vector4< T > operator-( Vector4 v ) const
	{
		return Vector4< T >( x - v.x, y - v.y, z - v.z, w - v.w );
	}

	Vector4< T > operator/( T v ) const
	{
		return Vector4< T >( x / v, y / v, z / v, w / v );
	}
	Vector4< T > operator/( Vector4 v ) const
	{
		return Vector4< T >( x / v.x, y / v.y, z / v.z, w / v.w );
	}

	Vector4< T > operator*( T v ) const
	{
		return Vector4< T >( x * v, y * v, z * v, w * v );
	}
	Vector4< T > operator*( Vector4 v ) const
	{
		return Vector4< T >( x * v.x, y * v.y, z * v.z, w * v.w );
	}

	Vector4< T > operator%( Uint16 v ) const
	{
		return Vector4< T >( T( fmod( Uint16( x ), v ) ), T( fmod( Uint16( y ), v ) ), T( fmod( Uint16( z ), v ) ) );
	}
	Vector4< T > operator%( Vector4< Uint16 > v ) const
	{
		return Vector4< T >( T( fmod( Uint16( x ), v.x ) ), T( fmod( Uint16( y ), v.y ) ), T( fmod( Uint16( z ), v.z ) ) );
	}

	bool operator==( Vector4 v ) const
	{
		return bool( x == v.x && y == v.y && z == v.z );
	}

	Vector4< T > abs( GLfloat p_denominator = 1 ) const
	{
		return Vector4< T >( T( fabsf( GLfloat( x ) / p_denominator ) ), T( fabsf( GLfloat( y ) / p_denominator ) ), T( fabsf( GLfloat( z ) / p_denominator ) ) );
	}

	Vector4< T > floor( GLfloat p_denominator = 1 ) const
	{
		return Vector4< T >( T( floorf( GLfloat( x ) / p_denominator ) ), T( floorf( GLfloat( y ) / p_denominator ) ), T( floorf( GLfloat( z ) / p_denominator ) ) );
	}

	Vector4< T > round( GLfloat p_denominator = 1 ) const
	{
		return Vector4< T >( T( roundf( GLfloat( x ) / p_denominator ) ), T( roundf( GLfloat( y ) / p_denominator ) ), T( roundf( GLfloat( z ) / p_denominator ) ) );
	}

	Vector4< T > ceil( GLfloat p_denominator = 1 ) const
	{
		return Vector4< T >( T( ceilf( GLfloat( x ) / p_denominator ) ), T( ceilf( GLfloat( y ) / p_denominator ) ), T( ceilf( GLfloat( z ) / p_denominator ) ) );
	}

	Vector4< T > mod( T p_value ) const
	{
		return Vector4< T >( T( modf( x, p_value ) ), T( modf( y, p_value ) ), T( modf( z, p_value ) ) );
	}

	Vector4< T > getNormal() const
	{
		GLfloat len = getLength();
		return Vector4< T >( ( x == 0 ? 0 : T( x / len ) ), ( y == 0 ? 0 : T( y / len ) ), ( z == 0 ? 0 : T( z / len ) ) );
	}

	Vector4< T > cross( Vector4 p_vec ) const
	{
		Vector4< T > c;
		c.x = p_vec.y * z - p_vec.z * y;
		c.y = p_vec.z * x - p_vec.x * z;
		c.z = p_vec.x * y - p_vec.y * x;
		return c;
	}

	GLfloat getLength() const
	{
		return sqrtf( x*x + y*y + z*z );
	}
};
