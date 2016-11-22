#include "engine\gfx\LTexture.h"

#include "engine\utils\OpenGL.h"
#include "engine\utils\Utilities.h"

#include <IL\il.h>
#include <IL\ilut.h>

LTexture::LTexture()
{
	ilInit();
	iluInit();
	ilutInit();
}

GLuint LTexture::getPrevId()
{
	return m_imgId;
}

GLuint LTexture::loadImage(std::string src)
{
	std::string _src = "res\\texture\\" + src;
	ilGenImages(1, &m_imgId);
	ilBindImage(m_imgId);
	ilLoadImage(_src.c_str());
	Texture p_temp(src, 0, Vector2<Sint32>(Sint32(ilGetInteger(IL_IMAGE_WIDTH)), Sint32(ilGetInteger(IL_IMAGE_HEIGHT))));
	if(MTexture::getInstance().contains(p_temp))
	{
		ilDeleteImage(m_imgId);
		return MTexture::getInstance().getUnitID(p_temp);
	}
	else
	{
		ilutRenderer(ILUT_OPENGL);
		m_imgId = ilutGLBindTexImage();
		return MTexture::getInstance().addUnit(Texture(src, m_imgId, Vector2<Sint32>(Sint32(ilGetInteger(IL_IMAGE_WIDTH)), Sint32(ilGetInteger(IL_IMAGE_HEIGHT)))));
	}
}

void LTexture::freeTex(GLuint id)
{
	if(id == -1)
	{
		id = m_imgId;
		m_imgId = 0;
	}
	ilDeleteImage(id);
}
