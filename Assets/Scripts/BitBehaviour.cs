using UnityEngine;
using System.Collections;

public class BitBehaviour : MonoBehaviour {

	public bool destroyOnHit = true;

	public AudioClip collectSFX;

	private GameObject parent;

	void Start() {
		Debug.Log ("STARTING");
		parent = transform.parent.gameObject;
		Debug.Log ("GOT PARENT" + parent);

	}



	void OnCollisionEnter2D(Collision2D newCollision) {
		if (collectSFX)
		{
			AudioSource.PlayClipAtPoint (collectSFX, GameObject.Find("Main Camera").transform.position);	
		}

		GameManager.gm.collectBit();

		parent.GetComponent<FirewallBehaviour> ().collectBit ();

		Destroy (gameObject);
	}
}
