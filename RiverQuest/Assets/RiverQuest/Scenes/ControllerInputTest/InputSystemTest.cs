using UnityEngine;
using System.Collections;
using GamepadInput;

namespace RiverQuest.InputSystem
{
    public class InputSystemTest : MonoBehaviour
    {
        public InputCodeManager Manager; 

        private void Update()
        {
            if (GamePad.GetButtonUp(GamePad.Button.Start, GamePad.Index.One))
            {
                Manager.StartInputSequence(GamePad.Index.One, () => { Debug.Log("STEP COMPLETE"); }, () => { Debug.Log("ALL COMPLETE"); }, 10);
            }
        }
    }
}

    



