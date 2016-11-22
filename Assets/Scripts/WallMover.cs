using UnityEngine;
using System.Collections;

public class WallMover : MonoBehaviour {

	Rigidbody2D _rigidbody;

	public float moveSpeed = 5.0f;
	// Use this for initialization
	void Awake () {
		_rigidbody = GetComponent<Rigidbody2D> ();

		_rigidbody.velocity = new Vector2 (-moveSpeed, 0);
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
