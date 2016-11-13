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
                StartSequence();                
            }
        }

        private void StartSequence(InputCodeManager.CodeSquence seq = null)
        {
            Manager.StartInputSequence(GamePad.Index.One, OnStepComplete, OnSequenceComplete, OnSequenceFailed, true, 10, true, true, false, seq);
        }

        private void OnStepComplete(AbstractInput nextStep)
        {
            Debug.Log("STEP COMPLETE, NEXT " + nextStep.Name);
        }

        private void OnSequenceComplete(InputCodeManager.CodeSquence seq)
        {
            Debug.Log("SEQ OF LENGTH " + seq.Sequence.Count + " COMPLETE");
        }

        private void OnSequenceFailed(InputCodeManager.CodeSquence seq)
        {
            StartSequence(seq);
        }
    }
}

    



