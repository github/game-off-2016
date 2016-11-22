#pragma once

#include "utils/general.h"
#include <stdio.h>

#include "game/camera.h"

#include "gfx/texutils.h"

#include "utils/general.h"

class Texture
{
    public:
        Texture();
        virtual ~Texture();

		void loadFromFile(
			const char* path,
			GLuint w = 32,
			GLuint h = 32,
			bool printLoaded = true);
		void loadFromText(
			const char* text,
			SDL_Color color);

        void free();
		void freeVBO();

        void setAlpha(
			Uint8 a);

		void render(
			GLfloat x,
			GLfloat y,
			Rectf* clip = NULL,
			GLfloat stretchWidth = NULL,
            GLfloat stretchHeight = NULL,
			float angle = 0.f,
			Vector2f* center = NULL,
			SDL_Color color = color(255, 255, 255, 255)) const;

		GLuint getTextureID() const;
		GLuint getWidth() const;
		GLuint getHeight() const;

    private:
        //texture id
		GLuint m_texture;
		GLenum m_textureFormat;
		GLuint m_width, m_height;
		GLuint m_VBOid, m_IBOid; //Vertex Buffer Object id, Index Buffer Object id

		Uint8 m_alpha;
};
