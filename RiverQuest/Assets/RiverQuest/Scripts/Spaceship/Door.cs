using System;
using RiverQuest.Controller;
using UnityEngine;

namespace RiverQuest.Spaceship
{
    [RequireComponent(typeof(Animator))]
    public class Door : MonoBehaviour, IActivatable
    {
        [SerializeField]
        public bool IsOpen { get; private set; }

        private Animator _animator;
        private OxygenTransfer _o2transfer;

        public void Awake()
        {
            _animator = GetComponent<Animator>();
            _o2transfer = GetComponent<OxygenTransfer>();
            SetOpen(false);
        }

        public void SetOpen(bool isOpen)
        {
            IsOpen = isOpen;
            _animator.SetBool("IsOpen", IsOpen);
            _animator.SetTrigger("Activated");

            if (_o2transfer != null) _o2transfer.IsOpen = IsOpen;
        }

        public void Highlight()
        {
            GetComponent<MeshRenderer>().material.color = Color.red;
        }

        public void Unhighlight()
        {
            GetComponent<MeshRenderer>().material.color = Color.white;
        }

        public void Activate(MultiPadController controller)
        {
            SetOpen(!IsOpen);
        }
    }
}