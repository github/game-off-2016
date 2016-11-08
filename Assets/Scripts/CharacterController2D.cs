using UnityEngine;
using System.Collections;
using UnityEngine.SceneManagement; // include so we can load new scenes

public class CharacterController2D : MonoBehaviour {

    // player controls
    [Range(0.0f, 10.0f)] // create a slider in the editor and set limits on moveSpeed
    public float moveSpeed = 5f;

    // player health
    public int playerHealth = 1;

    // player can move?
    // we want this public so other scripts can access it but we don't want to show in editor as it might confuse designer
    [HideInInspector]
    public bool playerCanMove = true;

    // SFXs
    //public AudioClip coinSFX;
    //public AudioClip deathSFX;
    //public AudioClip fallSFX;
    //public AudioClip jumpSFX;
    //public AudioClip victorySFX;

    // private variables below

    // store references to components on the gameObject
    Transform _transform;
    Rigidbody2D _rigidbody;
//    Animator _animator;
//   AudioSource _audio;

    // hold player motion in this timestep
    float _vx;
    float _vy;


    //probably keep this
    void Awake () {
//        // get a reference to the components we are going to be changing and store a reference for efficiency purposes
        _transform = GetComponent<Transform> ();

        _rigidbody = GetComponent<Rigidbody2D> ();
        if (_rigidbody==null) // if Rigidbody is missing
            Debug.LogError("Rigidbody2D component missing from this gameobject");
		_rigidbody.constraints = RigidbodyConstraints2D.FreezeRotation;
//        _animator = GetComponent<Animator>();
//        if (_animator==null) // if Animator is missing
//            Debug.LogError("Animator component missing from this gameobject");
//
//        _audio = GetComponent<AudioSource> ();
//        if (_audio==null) { // if AudioSource is missing
//            Debug.LogWarning("AudioSource component missing from this gameobject. Adding one.");
//            // let's just add the AudioSource component dynamically
//            _audio = gameObject.AddComponent<AudioSource>();
//        }
//
//        // determine the player's specified layer
//        _playerLayer = this.gameObject.layer;
//
//        // determine the platform's specified layer
//        _platformLayer = LayerMask.NameToLayer("Platform");
    }

    // this is where most of the player controller magic happens each game event loop
    void Update()
    {
        // exit update if player cannot move or game is paused
        if (!playerCanMove || (Time.timeScale == 0f))
            return;

        // determine horizontal velocity change based on the horizontal input
        _vy = Input.GetAxisRaw ("Vertical");


        // Change the actual velocity on the rigidbody
        _rigidbody.velocity = new Vector2(0, _vy * moveSpeed);
    }



//    // do what needs to be done to freeze the player
//    void FreezeMotion() {
//        playerCanMove = false;
//        _rigidbody.isKinematic = true;
//    }
//
//    // do what needs to be done to unfreeze the player
//    void UnFreezeMotion() {
//        playerCanMove = true;
//        _rigidbody.isKinematic = false;
//    }

}
