#pragma once
#include "engine\utils\OpenGL.h"
#include "engine\utils\Singleton.h"
#include "engine\utils\variable\manager\TextureManager.h"

#include <string>

class LTexture : public Singleton< LTexture >
{
public:
	LTexture();
	GLuint getPrevId();
	GLuint loadImage(std::string src);
	void freeTex(GLuint id = -1);
private:
	GLuint m_imgId;
};
