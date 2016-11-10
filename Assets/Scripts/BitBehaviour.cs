using UnityEngine;
using System.Collections;

public class BitBehaviour : MonoBehaviour {

	public bool destroyOnHit = true;

	public AudioClip collectSFX;



	void OnCollisionEnter2D(Collision2D newCollision) {
		if (collectSFX)
		{
			AudioSource.PlayClipAtPoint (collectSFX, GameObject.Find("Main Camera").transform.position);	
		}

		GameManager.gm.collectBit();

		Destroy (gameObject);
	}
}
