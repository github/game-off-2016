#include "physics/physics.h"

float lerpApproach(
	float Goal, 
	float Current,
	float deltaTime)
{
    float Difference = Goal - Current;

    if(Difference > deltaTime)
        return Current + deltaTime;
    if(Difference < -deltaTime)
        return Current - deltaTime;

    return Goal;
}

GLdouble distanceSquared(
	Vector2f a, 
	Vector2f b)
{
	GLdouble deltaX = b.x - a.x;
	GLdouble deltaY = b.y - a.y;
	return deltaX*deltaX + deltaY*deltaY;
}