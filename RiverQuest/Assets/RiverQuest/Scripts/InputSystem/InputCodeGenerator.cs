using UnityEngine;
using System.Collections;
using GamepadInput;

namespace RiverQuest.InputSystem
{
    public static class InputCodeGenerator
    {
        public static InputCodeManager.CodeSquence GetCodeSequence(int length, bool arrowsOnly)
        {
            var seq = new InputCodeManager.CodeSquence();
            for (var i = 0; i < length; i++)
            {
                AbstractInput entry = new Button();
                var rand = arrowsOnly ? 2 : UnityEngine.Random.Range(0, 2);
                switch (rand)
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

            seq.Current = seq.Sequence[0];

            return seq;
        }

    }
}

