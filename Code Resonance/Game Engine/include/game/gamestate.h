#pragma once

#include "utils/singleton.h"

class GameState
{
    public:
        virtual ~GameState(){};

        virtual void render() const = 0 ;
        virtual void update(
			float deltaTime) = 0;
		virtual void handleEvents() = 0;
};
