using UnityEngine;

namespace RiverQuest.Spaceship
{
    [RequireComponent(typeof(Animator))]
    public class Door : MonoBehaviour
    {
        [SerializeField]
        public bool IsOpen { get; private set; }

        private Animator _animator;
        private OxygenTransfer _o2transfer;

        public void Awake()
        {
            _animator = GetComponent<Animator>();
            _o2transfer = GetComponent<OxygenTransfer>();
            IsOpen = false;
        }

        public void SetOpen(bool isOpen)
        {
            IsOpen = isOpen;
            _animator.SetBool("IsOpen", IsOpen);
            _animator.SetTrigger("Activated");

            if (_o2transfer != null) _o2transfer.IsOpen = IsOpen;
        }
    }
}