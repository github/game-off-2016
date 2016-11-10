using UnityEngine;
using System.Collections;
using System;

namespace RiverQuest.Spaceship
{
    public class OxygenTransfer : MonoBehaviour
    {
        public Room Room1;
        public Room Room2;

        public bool IsOpen;

        private float _timeSinceOpen;
        private static float TimePerQxygenExchange = 0.5f;

        public void Start()
        {
            if (Room1 == null && Room2 == null) throw new Exception("No room set for door " + name + ".");
        }

        // Update is called once per frame
        public void FixedUpdate()
        {
            if(IsOpen)
            {
                ExchangeOxygen(Time.fixedDeltaTime);
            }
        }

        private void ExchangeOxygen(float seconds)
        {
            _timeSinceOpen += seconds;

            if(_timeSinceOpen < TimePerQxygenExchange)
            {
                return;
            }

            _timeSinceOpen -= TimePerQxygenExchange;

            if(Room1 == null)
            {
                Room2.Oxygen--;
                return;
            }

            if(Room2 == null)
            {
                Room1.Oxygen--;
                return;
            }

            if (Room1.Oxygen == Room2.Oxygen) return;

            if(Room1.Oxygen > Room2.Oxygen)
            {
                Room1.Oxygen--;
                Room2.Oxygen++;
            }
            else
            {
                Room1.Oxygen++;
                Room2.Oxygen--;
            }
        }
    }
}