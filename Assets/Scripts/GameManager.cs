using UnityEngine;
using System.Collections;

public class GameManager : MonoBehaviour {


	public static GameManager gm;

	public bool gameIsOver = false;

	//private int bitCounter = 0;
	// Use this for initialization
	void Start () {
	

		// get a reference to the GameManager component for use by other scripts
		if (gm == null) 
			gm = this.gameObject.GetComponent<GameManager>();
	}
	
	// Update is called once per frame
	void Update () {
	//TODO: implement this
	}

	public void RestartGame(){
		//TODO: implement this
	}

	public void collectBit(){
		//TODO: Implement this
		Debug.Log("Collected a bit");
	}
}
