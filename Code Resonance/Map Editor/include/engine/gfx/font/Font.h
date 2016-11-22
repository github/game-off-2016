#pragma once

#include "..\LTexture.h"
#include "engine\utils\Utilities.h"
#include "engine\utils\Singleton.h"

enum Alignment
{
	ALIGN_LEFT = 0,
	ALIGN_CENTER = 1,
	ALIGN_RIGHT = 2
};

class Font : public Singleton < Font >
{
public:
	void setAlignment(Alignment p_alignment);

	void setFont(std::string p_src);
	void setFontId(GLuint p_id);

	void setFontSize(Sint32 p_fontSize);

	GLuint getFontId();

	void print(std::string p_msg, Sint32 p_x, Sint32 p_y);

private:
	GLuint m_fontSheet;

	Alignment m_alignment;
	Sint32 m_fontSize;
};
