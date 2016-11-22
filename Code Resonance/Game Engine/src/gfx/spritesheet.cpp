#include "gfx/spritesheet.h"

SpriteSheet::SpriteSheet()
{
	m_vertexDataBuffer = NULL;
	m_indexBuffers = NULL;
}

SpriteSheet::~SpriteSheet()
{
	free();
}

void SpriteSheet::free()
{
	freeSheet();
	Texture::free();
}

void SpriteSheet::freeSheet()
{
	if (m_vertexDataBuffer != NULL)
	{
		glDeleteBuffers(1, &m_vertexDataBuffer);
		m_vertexDataBuffer = NULL;
	}

	if (m_indexBuffers != NULL)
	{
		glDeleteBuffers(m_Clips.size(), m_indexBuffers);
		delete[] m_indexBuffers;
		m_indexBuffers = NULL;
	}

	m_Clips.clear();
}

int SpriteSheet::addClipSprite(
	Rectf& newClip)
{
	m_Clips.push_back(newClip);
	return m_Clips.size() - 1;
}

Rectf SpriteSheet::getClip(
	int index)
{
	return m_Clips[index];
}

void SpriteSheet::generateDataBuffer()
{
	if (getTextureID() != 0 && m_Clips.size() > 0)
	{
		//Allocate vertex buffer data
		int totalSprites = m_Clips.size();
		VertexData2f* vertexData = new VertexData2f[totalSprites * 4];
		m_indexBuffers = new GLuint[totalSprites];

		glGenBuffers(1, &m_vertexDataBuffer);
		glGenBuffers(totalSprites, m_indexBuffers);

		GLfloat tW = (GLfloat)getWidth();
		GLfloat tH = (GLfloat)getHeight();
		GLuint spriteIndices[4] = { 0, 0, 0, 0 };

		for (int i = 0; i < totalSprites; ++i)
		{
			//Initialize indices
			spriteIndices[0] = i * 4 + 0;
			spriteIndices[1] = i * 4 + 1;
			spriteIndices[2] = i * 4 + 2;
			spriteIndices[3] = i * 4 + 3;

			//Top left
			vertexData[spriteIndices[0]].position.x = 0.f;
			vertexData[spriteIndices[0]].position.y = 0.f;
			vertexData[spriteIndices[0]].texCoord.s = (m_Clips[i].x) / tW;
			vertexData[spriteIndices[0]].texCoord.t = (m_Clips[i].y) / tH;

			//Top right
			vertexData[spriteIndices[1]].position.x = m_Clips[i].w;
			vertexData[spriteIndices[1]].position.y = 0.f;
			vertexData[spriteIndices[1]].texCoord.s = (m_Clips[i].x + m_Clips[i].w) / tW;
			vertexData[spriteIndices[1]].texCoord.t = (m_Clips[i].y) / tH;

			//Bottom right
			vertexData[spriteIndices[2]].position.x = m_Clips[i].w;
			vertexData[spriteIndices[2]].position.y = m_Clips[i].h;
			vertexData[spriteIndices[2]].texCoord.s = (m_Clips[i].x + m_Clips[i].w) / tW;
			vertexData[spriteIndices[2]].texCoord.t = (m_Clips[i].y + m_Clips[i].h) / tH;

			//Bottom left
			vertexData[spriteIndices[3]].position.x = 0.f;
			vertexData[spriteIndices[3]].position.y = m_Clips[i].h;
			vertexData[spriteIndices[3]].texCoord.s = (m_Clips[i].x) / tW;
			vertexData[spriteIndices[3]].texCoord.t = (m_Clips[i].y + m_Clips[i].h) / tH;

			glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, m_indexBuffers[i]);
			glBufferData(GL_ELEMENT_ARRAY_BUFFER, 4 * sizeof(GLuint), spriteIndices, GL_STATIC_DRAW);
		}

		glBindBuffer(GL_ARRAY_BUFFER, m_vertexDataBuffer);
		glBufferData(GL_ARRAY_BUFFER, totalSprites * 4 * sizeof(VertexData2f), vertexData, GL_STATIC_DRAW);

		//Deallocate vertex data
		delete[] vertexData;
	}
	else
	{
		if (getTextureID() == 0)
			printf("No texture to render with!\n");

		if (m_Clips.size() <= 0)
			printf("No clips to generate vertex data from!\n");
	}
}

void SpriteSheet::renderSprite(
	GLfloat x,
	GLfloat y,
	int index)
{
	if (m_vertexDataBuffer != NULL)
	{
		glPopMatrix();
		glPushMatrix();

		glColor3f(1.f, 1.f, 1.f);

		glTranslatef(x, y, 0.f);

		glBindTexture(GL_TEXTURE_2D, getTextureID());

		glEnableClientState(GL_VERTEX_ARRAY);
		glEnableClientState(GL_TEXTURE_COORD_ARRAY);
			glBindBuffer(GL_ARRAY_BUFFER, m_vertexDataBuffer);

			glTexCoordPointer(2, GL_FLOAT, sizeof(VertexData2f), (GLvoid*)offsetof(VertexData2f, texCoord));
			glVertexPointer(2, GL_FLOAT, sizeof(VertexData2f), (GLvoid*)offsetof(VertexData2f, position));

			//Draw quad using vertex data and index data
			glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, m_indexBuffers[index]);
			glDrawElements(GL_QUADS, 4, GL_UNSIGNED_INT, NULL);
		glDisableClientState(GL_TEXTURE_COORD_ARRAY);
		glDisableClientState(GL_VERTEX_ARRAY);

		glBindTexture(GL_TEXTURE_2D, NULL);
	}
}