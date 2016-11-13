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
            if (Input.GetKeyUp(KeyCode.Space))
            {
                Manager.StartInputSequence(GamePad.Index.One, nextStep => 
                {
                    Debug.Log("STEP COMPLETE, NEXT " + nextStep.Name);
                }, seq => 
                {
                    Debug.Log("SEQ OF LENGTH " + seq.Sequence.Count + " COMPLETE");
                }, 10);
            }
        }
    }
}

    



