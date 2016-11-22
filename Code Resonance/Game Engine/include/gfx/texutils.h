#pragma once

#include "utils/general.h"
#include "utils/vector2f.h"

SDL_Color color(
	Uint8 r,
	Uint8 g,
	Uint8 b,
	Uint8 a);
void renderEmptyBox(
	Rectf box,
	SDL_Color color);
void renderFillRect(
	Rectf box,
	SDL_Color color);

void changeFontSize(
	int ptsize);

struct VertexPos2f
{
	GLfloat x;
	GLfloat y;
};

struct TexCoord2f
{
	GLfloat s;
	GLfloat t;
};

struct VertexData2f
{
	VertexPos2f position;
	TexCoord2f texCoord;
};