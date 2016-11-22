using UnityEngine;
using System.Collections;

public class FirewallBehaviour : MonoBehaviour {


	private int numChildren = 0;
	// Use this for initialization
	void Start () {
		foreach (Transform child in transform) {
			numChildren++;
			Debug.Log ("I have a child!");
		}
	}
		
	
	// Update is called once per frame
	void Update () {
	
	}

	public void collectBit(){
		Debug.Log ("YOU ATE A CHILD");
		numChildren--;
		if (numChildren == 0) {
			Destroy (gameObject);
		}
	}


	void OnTriggerEnter2D(Collider2D newCollision) {
		Debug.Log ("HIT THE WALL");



		if (newCollision.gameObject.tag == "Player") {
			Destroy (GameObject.Find("Knife"));
			//GameManager.gm.damage();
		}
	}
}
