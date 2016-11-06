#include "gfx/texture.h"

Texture::Texture()
{
	m_texture = NULL;
	m_width = 0;
	m_height = 0;

	m_VBOid = 0;
	m_IBOid = 0;
}

Texture::~Texture()
{
	free();
	freeVBO();
}

void Texture::loadFromFile(
	const char* path,
	GLuint w,
	GLuint h,
	bool printLoaded)
{
	free();

	SDL_Surface* _surface = IMG_Load(path);
	GLuint* _pixels = NULL;
	if (_surface == NULL)
		printf("Unable to load image %s!\n", path);

	if (_surface)
	{
		m_width = _surface->w;
		m_height = _surface->h;
	}
	else
	{
		m_width = w;
		m_height = h;
		printf("Creating texture %d, %d \n", w, h);
		m_textureFormat = GL_RGBA;
		_pixels = new GLuint[w * h];
		for (GLuint i = 0; i < (w * h); i++)
		{
			GLubyte* _colors = (GLubyte*)&_pixels[i];
			_colors[0] = 0xFF; _colors[1] = 0xFF; _colors[2] = 0xFF; _colors[3] = 0xFF;
		}
	}

	if (_surface != NULL)
	{
		if (_surface->format->BytesPerPixel == 4)
			m_textureFormat = GL_RGBA;
		else if (_surface->format->BytesPerPixel == 3)
			m_textureFormat = GL_RGB;
	}

	glGenTextures(1, &m_texture);
	glBindTexture(GL_TEXTURE_2D, m_texture);
	if (_surface != NULL)
		glTexImage2D(GL_TEXTURE_2D, 0, m_textureFormat, m_width, m_height, 0, m_textureFormat, GL_UNSIGNED_BYTE, _surface->pixels);
	else
		glTexImage2D(GL_TEXTURE_2D, 0, m_textureFormat, m_width, m_height, 0, m_textureFormat, GL_UNSIGNED_BYTE, _pixels);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

	glBindTexture(GL_TEXTURE_2D, NULL);

	if (glGetError() != GL_NO_ERROR)
		printf("Error loading texture! %s Path:%s \n", gluErrorString(glGetError()), path);

	///Initialize VBO
	if (m_texture != 0 && m_VBOid == 0)
	{
		//Vertex data
		VertexData2f vData[4]; //To be set later in the render function
		GLuint iData[4];

		//Set rendering indices
		iData[0] = 0;
		iData[1] = 1;
		iData[2] = 2;
		iData[3] = 3;

		//VBO
		glGenBuffers(1, &m_VBOid);
		glBindBuffer(GL_ARRAY_BUFFER, m_VBOid);
		glBufferData(GL_ARRAY_BUFFER, 4 * sizeof(VertexData2f), vData, GL_DYNAMIC_DRAW);

		//IBO
		glGenBuffers(1, &m_IBOid);
		glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, m_IBOid);
		glBufferData(GL_ELEMENT_ARRAY_BUFFER, 4 * sizeof(GLuint), iData, GL_DYNAMIC_DRAW);

		glBindBuffer(GL_ARRAY_BUFFER, NULL);
		glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, NULL);
	}

	if(printLoaded) printf("Loaded %s\n", path);

	SDL_FreeSurface(_surface);
}

void Texture::loadFromText(
	const char* text,
	SDL_Color color)
{
	free();

	SDL_Surface* _surface = TTF_RenderText_Blended(g_font, text, color);
	if (_surface == NULL)
		printf("Unable to load image %s!\n", text);

	m_width = _surface->w;
	m_height = _surface->h;

	if (_surface->format->BytesPerPixel == 4)
		m_textureFormat = GL_RGBA;
	else if (_surface->format->BytesPerPixel == 3)
		m_textureFormat = GL_RGB;

	glGenTextures(1, &m_texture);
	glBindTexture(GL_TEXTURE_2D, m_texture);
	glTexImage2D(GL_TEXTURE_2D, 0, m_textureFormat, m_width, m_height, 0, m_textureFormat, GL_UNSIGNED_BYTE, _surface->pixels);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

	glBindTexture(GL_TEXTURE_2D, NULL);

	if (glGetError() != GL_NO_ERROR)
		printf("Error loading texture! %s\n", gluErrorString(glGetError()));

	///Initialize VBO
	if (m_texture != 0 && m_VBOid == 0)
	{
		//Vertex data
		VertexData2f vData[4]; //To be set later in the render function
		GLuint iData[4];

		//Set rendering indices
		iData[0] = 0;
		iData[1] = 1;
		iData[2] = 2;
		iData[3] = 3;

		//VBO
		glGenBuffers(1, &m_VBOid);
		glBindBuffer(GL_ARRAY_BUFFER, m_VBOid);
		glBufferData(GL_ARRAY_BUFFER, 4 * sizeof(VertexData2f), vData, GL_DYNAMIC_DRAW);

		//IBO
		glGenBuffers(1, &m_IBOid);
		glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, m_IBOid);
		glBufferData(GL_ELEMENT_ARRAY_BUFFER, 4 * sizeof(GLuint), iData, GL_DYNAMIC_DRAW);

		glBindBuffer(GL_ARRAY_BUFFER, NULL);
		glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, NULL);
	}

	SDL_FreeSurface(_surface);
}

void Texture::free()
{
	if (m_texture != 0)
	{
		glDeleteTextures(1, &m_texture);
		m_texture = 0;
	}
	m_width = 0;
	m_height = 0;
}

void Texture::freeVBO()
{
	if(m_VBOid != 0)
	{
		glDeleteBuffers(1, &m_VBOid);
		glDeleteBuffers(1, &m_IBOid);
	}
}

void Texture::setAlpha(
	Uint8 a)
{
	m_alpha = a;
}

void Texture::render(
	GLfloat x,
	GLfloat y,
	Rectf* clip,
	GLfloat stretchWidth,
	GLfloat stretchHeight,
	float angle,
	Vector2f* center,
	SDL_Color color) const
{
	if (m_texture != 0)
	{
		Rectf texCoords = { 0.f, 1.f, 0.f, 1.f }; //Top Bottom Left Right

		GLfloat quadWidth = (GLfloat)m_width;
		GLfloat quadHeight = (GLfloat)m_height;

		if (clip != NULL)
		{
			//Convert to texture coordinates
			texCoords = { clip->y / m_height, (clip->y + clip->h) / m_height,
				 clip->x / m_width, (clip->x + clip->w) / m_width };

			quadWidth = clip->w;
			quadHeight = clip->h;
		}

		if (stretchWidth || stretchHeight)
		{
			//(TODO) Possibly add an if statement for clipping
			quadWidth = stretchWidth;
			quadHeight = stretchHeight;
		}


		glPopMatrix();
		glPushMatrix();

		glColor4f(color.r / 255.f, color.g / 255.f, color.b / 255.f, color.a / 255.f);
		if(g_isPlayerDead) glColor4f(255.f, 0, 0, 255.f);

		glTranslatef(x, y, 0.f);

		if (center != NULL)
		{
			glTranslatef(center->x, center->y, 0.f);
			glRotatef(angle, 0.f, 0.f, 1.f);
			glTranslatef(-center->x, -center->y, 0.f);
		}

		VertexData2f vData[4]; //Vertex Data

		vData[0].texCoord.s = texCoords.w; vData[0].texCoord.t = texCoords.x;
		vData[1].texCoord.s = texCoords.h; vData[1].texCoord.t = texCoords.x;
		vData[2].texCoord.s = texCoords.h; vData[2].texCoord.t = texCoords.y;
		vData[3].texCoord.s = texCoords.w; vData[3].texCoord.t = texCoords.y;

		vData[0].position.x = 0.f;			vData[0].position.y = 0.f;
		vData[1].position.x = quadWidth;	vData[1].position.y = 0.f;
		vData[2].position.x = quadWidth;	vData[2].position.y = quadHeight;
		vData[3].position.x = 0.f;			vData[3].position.y = quadHeight;

		glBindTexture(GL_TEXTURE_2D, m_texture);

		glEnableClientState(GL_VERTEX_ARRAY);
		glEnableClientState(GL_TEXTURE_COORD_ARRAY);
			glBindBuffer(GL_ARRAY_BUFFER, m_VBOid);

			//Update vertex buffer data
			glBufferSubData(GL_ARRAY_BUFFER, 0, 4 * sizeof(VertexData2f), vData);

			glTexCoordPointer(2, GL_FLOAT, sizeof(VertexData2f), (GLvoid*)offsetof(VertexData2f, texCoord));
			glVertexPointer(2, GL_FLOAT, sizeof(VertexData2f), (GLvoid*)offsetof(VertexData2f, position));

			//Draw quad using vertex data and index data
			glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, m_IBOid);
			glDrawElements(GL_QUADS, 4, GL_UNSIGNED_INT, NULL);
		glDisableClientState(GL_TEXTURE_COORD_ARRAY);
		glDisableClientState(GL_VERTEX_ARRAY);

		glBindTexture(GL_TEXTURE_2D, NULL);
	}
}

GLuint Texture::getTextureID() const
{
	return m_texture;
}

GLuint Texture::getWidth() const
{
	return m_width;
}

GLuint Texture::getHeight() const
{
	return m_height;
}
