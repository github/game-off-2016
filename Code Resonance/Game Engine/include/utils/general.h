#pragma once

#define GLEW_STATIC // This must be defined when statically linking to GLEW
#include <GL/glew.h>

#pragma comment (lib, "glew32s.lib") // Link to glew32s.lib

#include <GL/GLU.h>
#include <SDL.h>
#include <SDL_opengl.h>
#include <SDL_image.h>
#include <SDL_ttf.h>
#include <SDL_mixer.h>

#include "game/gamestate.h"

constexpr unsigned SCREEN_WIDTH =			1280;
constexpr unsigned SCREEN_HEIGHT =			720;
constexpr unsigned SCREEN_FPS =				60;
constexpr unsigned SCREEN_TICKS_PER_FRAME =	1000 / SCREEN_FPS;

constexpr double PI = 3.14159265;

constexpr unsigned MAX_PROJECTILE_AMOUNT = 600;

extern SDL_Window* g_window;
extern SDL_Event g_event;
extern TTF_Font* g_font;

extern bool g_showCollisionBox;
extern bool g_isPlayerDead;

extern GameState* g_gameState;
