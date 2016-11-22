using UnityEngine;
using System.Collections;

public class WallBehaviour : MonoBehaviour {

	public bool destroyOnHit = true;

	public AudioClip collectSFX;



	void OnTriggerEnter2D(Collider2D newCollision) {
		Debug.Log ("HIT THE WALL");



		if (newCollision.gameObject.tag == "Player") {
			Destroy (GameObject.Find("Knife"));
			//GameManager.gm.damage();
		}
	}
}
