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
            public Action<AbstractInput> OnStepCompleted;
            public Action<CodeSquence> OnSequenceCompleted;
            public Action<CodeSquence> OnSequenceFailed;
            public CodeSquence Sequence;
            public bool PunishFail;
            public TimeSpan Time;
            public DateTime StartTime;
            public bool Done = false;

            public PlayerInputTask(GamePad.Index index, Action<AbstractInput> stepCompleted, Action<CodeSquence> sequenceCompleted, Action<CodeSquence> sequenceFailed, bool punish, CodeSquence sequence, TimeSpan time)
            {
                PlayerIndex = index;
                OnStepCompleted = stepCompleted;
                OnSequenceCompleted = sequenceCompleted;
                Sequence = sequence;
                OnSequenceFailed = sequenceFailed;
                PunishFail = punish;
                Time = time;

                Start();
            }

            public void Start()
            {
                StartTime = DateTime.Now;
            }

            public bool Next()
            {
                var next = Sequence.NextStep();

                if (next)
                {
                    OnStepCompleted(Sequence.Current);
                }
                else
                {
                    OnSequenceCompleted(Sequence);
                }

                return next;
            }

            public void Fail()
            {
                OnSequenceFailed(Sequence);
            }

            public TimeSpan GetRemainingTime()
            {
                var end = StartTime + Time;
                var delta = end - DateTime.Now;
                var remaining = Time - delta;

                return delta;
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

            public bool NextStep()
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
            var remove = new List<KeyValuePair<GamePad.Index, PlayerInputTask>>();

            foreach (var kvp in _activeInputSequences)
            {
                //Debug.Log("REMAINING TIME " + kvp.Value.GetRemainingTime());

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
                        var axis = ((Direction)inputAction).Axis;
                        check = GamePad.GetDirection(axis, direction, index);
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
                        remove.Add(kvp);                        
                    }
                }
            }

            foreach(var kvp in remove)
            {
                _activeInputSequences.Remove(kvp.Key);
            }
        }

        public void StartInputSequence(GamePad.Index player, TimeSpan time, Action<AbstractInput> stepCompleted, Action<CodeSquence> sequenceCompleted, Action<CodeSquence> inputFail, 
            bool punishFail, int length, bool useButtons = true, bool useDirections = true, bool useTriggers = false, 
            CodeSquence sequence = null)
        {
            if (sequence == null)
            {
                sequence = InputCodeGenerator.GetCodeSequence(length, useTriggers, useButtons, useDirections);
            }

            var seq = new PlayerInputTask(player, stepCompleted, sequenceCompleted, inputFail, punishFail, sequence, time);
            _activeInputSequences.Add(player, seq);

            if(time.Seconds > 0)
            {
                StartCoroutine(CheckEndTime(player, (float)time.Seconds));
            }            
        }

        private IEnumerator CheckEndTime(GamePad.Index player, float time)
        {
            yield return new WaitForSeconds(time);
            
            if(_activeInputSequences.ContainsKey(player))
            {
                var task = _activeInputSequences[player];
                if(!task.Done)
                {
                    _activeInputSequences.Remove(player);
                    task.Fail();
                }
            }
        }

        private void Update()
        {
            CheckInput();
        }
    }
}

