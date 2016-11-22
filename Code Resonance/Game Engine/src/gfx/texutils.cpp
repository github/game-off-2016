#include "gfx/texutils.h"

SDL_Color color(
	Uint8 r, 
	Uint8 g, 
	Uint8 b, 
	Uint8 a)
{
	SDL_Color _c = { r, g, b, a };
	return _c;
}

void renderEmptyBox(
	Rectf box, 
	SDL_Color color)
{
	glPopMatrix();
	glPushMatrix();

	glTranslatef(box.x, box.y, 0.f);

	glColor4f(color.r / 255.f, color.g / 255.f, color.b / 255.f, color.a / 255.f);

	glBegin(GL_LINES);
		glVertex2f(0.f, 0.f);
		glVertex2f(box.w, 0.f);
		glVertex2f(box.w, 0.f);
		glVertex2f(box.w, box.h);
		glVertex2f(box.w, box.h);
		glVertex2f(0.f, box.h);
		glVertex2f(0.f, box.h);
		glVertex2f(0.f, 0.f);
	glEnd();
}

void renderFillRect(
	Rectf box, 
	SDL_Color color)
{
	glPopMatrix();
	glPushMatrix();

	glTranslatef(box.x, box.y, 0.f);

	glColor4f(color.r / 255.f, color.g / 255.f, color.b / 255.f, color.a / 255.f);

	glBegin(GL_QUADS);
		glVertex2f(0.f, 0.f);
		glVertex2f(box.w, 0);
		glVertex2f(box.w, box.h);
		glVertex2f(0.f, box.h);
	glEnd();
}

void changeFontSize(
	int ptsize)
{
	g_font = TTF_OpenFont("res/arial.ttf", ptsize);
}