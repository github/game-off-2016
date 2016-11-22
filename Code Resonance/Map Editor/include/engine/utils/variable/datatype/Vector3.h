#pragma once
#include <math.h>

template< class T >
struct Vector3
{
	typedef float GLfloat;
	typedef unsigned short Uint16;

	T x, y, z;

	Vector3< T >()
	{ x = y = z = T( 0 ); }

	Vector3< T >( T p_x, T p_y, T p_z ) :
	x( p_x ), y( p_y ), z( p_z ) {}

	template< class C >
	Vector3< T >( Vector3< C > p_v )
	{
		x = T( p_v.x );
		y = T( p_v.y );
		z = T( p_v.z );
	}

	Vector3< T > operator+( T v ) const
	{ return Vector3< T >( x + v, y + v, z + v ); }
	Vector3< T > operator+( Vector3 v ) const
	{ return Vector3< T >( x + v.x, y + v.y, z + v.z ); }

	Vector3< T > operator-( T v ) const
	{ return Vector3< T >( x-v, y-v, z-v ); }
	Vector3< T > operator-( Vector3 v ) const
	{ return Vector3< T >( x - v.x, y - v.y, z - v.z ); }

	Vector3< T > operator/( T v ) const
	{ return Vector3< T >( x/v, y/v, z/v ); }
	Vector3< T > operator/( Vector3 v ) const
	{ return Vector3< T >( x / v.x, y / v.y, z / v.z ); }

	Vector3< T > operator*( T v ) const
	{ return Vector3< T >( x*v, y*v, z*v ); }
	Vector3< T > operator*( Vector3 v ) const
	{ return Vector3< T >( x*v.x, y*v.y, z*v.z ); }
	
	Vector3< T > operator%( Uint16 v ) const
	{ return Vector3< T >( T( fmod( Uint16( x ), v ) ), T( fmod( Uint16( y ), v ) ), T( fmod( Uint16( z ), v ) ) ); }
	Vector3< T > operator%( Vector3< Uint16 > v ) const
	{ return Vector3< T >( T( fmod( Uint16( x ), v.x ) ), T( fmod( Uint16( y ), v.y ) ), T( fmod( Uint16( z ), v.z ) ) ); }

	bool operator==( Vector3 v ) const
	{ return bool( x == v.x && y == v.y && z == v.z ); }

	Vector3< T > abs( GLfloat p_denominator = 1 ) const
	{ return Vector3< T >( T( fabsf( GLfloat( x ) / p_denominator ) ), T( fabsf( GLfloat( y ) / p_denominator ) ), T( fabsf( GLfloat( z ) / p_denominator ) ) ); }

	Vector3< T > floor( GLfloat p_denominator = 1 ) const
	{ return Vector3< T >( T( floorf( GLfloat( x ) / p_denominator ) ), T( floorf( GLfloat( y ) / p_denominator ) ), T( floorf( GLfloat( z ) / p_denominator ) ) ); }

	Vector3< T > round( GLfloat p_denominator = 1 ) const
	{ return Vector3< T >( T( roundf( GLfloat( x ) / p_denominator ) ), T( roundf( GLfloat( y ) / p_denominator ) ), T( roundf( GLfloat( z ) / p_denominator ) ) ); }

	Vector3< T > ceil( GLfloat p_denominator = 1 ) const
	{ return Vector3< T >( T( ceilf( GLfloat( x ) / p_denominator ) ), T( ceilf( GLfloat( y ) / p_denominator ) ), T( ceilf( GLfloat( z ) / p_denominator ) ) ); }

	Vector3< T > mod( T p_value ) const
	{ return Vector3< T >( T( modf( x, p_value ) ), T( modf( y, p_value ) ), T( modf( z, p_value ) ) ); }

	Vector3< T > getNormal() const
	{
		GLfloat len = getLength();
		return Vector3< T >( ( x == 0 ? 0 : T( x / len ) ), ( y == 0 ? 0 : T( y / len ) ), ( z == 0 ? 0 : T( z / len ) ) );
	}

	Vector3< T > cross( Vector3 p_vec ) const
	{
		Vector3< T > c;
		c.x = p_vec.y * z - p_vec.z * y;
		c.y = p_vec.z * x - p_vec.x * z;
		c.z = p_vec.x * y - p_vec.y * x;
		return c;
	}

	GLfloat dot( Vector3 p_vec ) const
	{
		return ( p_vec.x * x + p_vec.y * y + p_vec.z * z );
	}

	GLfloat getLength() const
	{ return sqrtf( GLfloat( x*x + y*y + z*z ) ); }
};
