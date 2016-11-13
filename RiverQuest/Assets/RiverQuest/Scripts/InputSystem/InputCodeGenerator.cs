using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using GamepadInput;

namespace RiverQuest.InputSystem
{
    public static class InputCodeGenerator
    {
        public static InputCodeManager.CodeSquence GetCodeSequence(int length, bool useTriggers, bool useButtons, bool useDirections)
        {
            var used = new List<int>();
            if (useButtons)
                used.Add(0);

            if (useTriggers)
                used.Add(1);

            if (useDirections)
                used.Add(2);

            var seq = new InputCodeManager.CodeSquence();
            for (var i = 0; i < length; i++)
            {
                AbstractInput entry = new Button();
                var rand = UnityEngine.Random.Range(0, used.Count);
                switch (used[rand])
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

