using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using GamepadInput;
using System;

namespace RiverQuest.InputSystem
{
    public class InputCodeManager : MonoBehaviour
    {
        private Dictionary<GamePad.Index, PlayerInputTask> _activeInputSequences = new Dictionary<GamePad.Index, PlayerInputTask>();

        public class PlayerInputTask
        {
            public GamePad.Index PlayerIndex;
            public Action OnStepCompleted;
            public Action OnSequenceCompleted;
            public CodeSquence Sequence;

            public PlayerInputTask(GamePad.Index index, Action stepCompleted, Action sequenceCompleted, CodeSquence sequence)
            {
                PlayerIndex = index;
                OnStepCompleted = stepCompleted;
                OnSequenceCompleted = sequenceCompleted;
                Sequence = sequence;
            }

            public bool Next()
            {
                var next = Sequence.Next();

                if (next)
                {
                    OnStepCompleted();
                }
                else
                {
                    OnSequenceCompleted();
                }

                return next;
            }
        }

        public class CodeSquence
        {
            public AbstractInput Current;
            public List<AbstractInput> Sequence = new List<AbstractInput>();

            public bool Equals(AbstractInput input)
            {
                return input == Current;
            }

            public bool Next()
            {
                var idx = Sequence.IndexOf(Current);
                if (Sequence.Count > idx + 1)
                {
                    Current = Sequence[idx + 1];
                    return true;
                }

                return false;
            }
        }

        public void CheckInput()
        {
            foreach (var kvp in _activeInputSequences)
            {
                var task = kvp.Value;
                var inputAction = task.Sequence.Current;
                var index = task.PlayerIndex;
                var check = false;

                switch (inputAction.GetInputType())
                {
                    case InputAction.Button:
                        var button = (GamePad.Button)Enum.Parse(typeof(GamePad.Button), inputAction.Name);
                        check = GamePad.GetButton(button, index);
                        break;
                    case InputAction.Direction:
                        var direction = (GamePad.Direction)Enum.Parse(typeof(GamePad.Direction), inputAction.Name);
                        var Axis = ((Direction)inputAction).Axis;
                        check = GamePad.GetDirection(GamePad.Axis.LeftStick, direction, index);
                        break;
                    case InputAction.Trigger:
                        var trigger = (GamePad.Trigger)Enum.Parse(typeof(GamePad.Trigger), inputAction.Name);
                        check = GamePad.GetTrigger(trigger, index) > 0f;
                        break;
                }

                if (check)
                {
                    var done = !task.Next();
                    if(done)
                    {
                        _activeInputSequences.Remove(task.PlayerIndex);
                    }
                }
            }
        }

        public void StartInputSequence(GamePad.Index player, Action stepCompleted, Action sequenceCompleted, int length)
        {
            var seq = new PlayerInputTask(player, stepCompleted, sequenceCompleted, InputCodeGenerator.GetCodeSequence(length, false));
            _activeInputSequences.Add(player, seq);
        }

        private void Update()
        {
            CheckInput();
        }
    }
}

