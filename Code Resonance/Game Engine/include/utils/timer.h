#pragma once

#include <SDL.h>

class Timer
{
    public:
		Timer();
        Timer(bool initialStart);

		void start();
		void stop();

		//Gets the timer's time in milliseconds
		unsigned int getTicks() const;

    private:
		unsigned int m_startTicks;

		bool m_started;
};
