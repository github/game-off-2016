#pragma once

template<typename C>
class Singleton {
	public:
        inline static C& getInstance() {

            static C I;
            return I;
        }
	protected:
        Singleton() {}
        Singleton(const C&) {}
        Singleton& operator=(const C&) {}
        virtual ~Singleton() {}
};
