using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using GamepadInput;

namespace RiverQuest.InputSystem
{
    public class InputCodeGenerator : MonoBehaviour
    {
        public class CodeSquence
        {
            public AbstractInput Current;
            public List<AbstractInput> Sequence = new List<AbstractInput>();

            public bool Check(AbstractInput input)
            {
                return input == Current;
            }
        }

        public void CheckInput(AbstractInput input)
        {

        }

        public static CodeSquence GetCodeSequence(int length, bool arrowsOnly)
        {
            var seq = new CodeSquence();
            for(var i = 0; i < length; i++)
            {
                AbstractInput entry = new Button();
                var rand = arrowsOnly ? 2 : Random.Range(0, 2);
                switch(rand)
                {
                    case 0:
                        entry = new Button();
                        break;
                    case 1:
                        entry = new Trigger();
                        break;
                    case 2:
                        entry = new Direction(GamePad.Axis.Dpad);
                        break;
                }

                entry.Randomize();

                Debug.Log("GENERATED INPUT OF TYPE " + entry.GetInputType().ToString() + " AND ITS A " + entry.Name);

                seq.Sequence.Add(entry);
            }

            return seq;
        }

        private void Update()
        {
            if(Input.GetKeyDown(KeyCode.J))
            {
                GetCodeSequence(15, false);
            }
        }
    }
}

