#pragma once

#include <vector>
#include "gfx/texture.h"

class SpriteSheet : public Texture
{
	public:
		SpriteSheet();
		~SpriteSheet();

		void free();
		void freeSheet();

		int addClipSprite(
			Rectf& newClip); //returns index
		Rectf getClip(
			int index);

		void generateDataBuffer();

		void renderSprite(
			GLfloat x, 
			GLfloat y,
			int index);
	private:
		std::vector<Rectf> m_Clips;

		GLuint m_vertexDataBuffer;
		GLuint* m_indexBuffers;

};