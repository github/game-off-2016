#pragma once
#include "utils\Utilities.h"

class AABB
{
private:
	static void getF( float x, float w, float l, double& near, double& far );

public:
	struct BoundingBox
	{
		float x, y, z;
		float w, h, d;

		BoundingBox()
		{
			x = y = z = 0;
			w = h = d = 1;
		};

		BoundingBox( Vector3< GLfloat > p_pos, Vector3< GLfloat > p_dimensions )
		{
			x = p_pos.x;
			y = p_pos.y;
			z = p_pos.z;

			w = p_dimensions.x;
			h = p_dimensions.y;
			d = p_dimensions.z;
		}

		void setPos( float x1, float y1, float z1 )
		{
			x = x1;
			y = y1;
			z = z1;
		}

		void setSize( float w1, float h1, float d1 )
		{
			w = w1;
			h = h1;
			d = d1;
		}
	};

	static bool checkCollisionLine( double& p_near, double& p_far, BoundingBox, Vector3< GLfloat > p_start, Vector3< GLfloat > p_endPoint ); /* returns 'near' float */
};
