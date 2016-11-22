using UnityEngine;
using System.Collections;

public class SpawnGameObjects : MonoBehaviour
{
	// public variables
	public float secondsBetweenSpawning = 0.1f;
	public float xMinRange = 12.0f;
	public float xMaxRange = 12.0f;
	public float yMinRange = -6.0f;
	public float yMaxRange = 6.0f;
	public GameObject[] spawnObjects; // what prefabs to spawn

	private float nextSpawnTime;

	// Use this for initialization
	void Start ()
	{
		// determine when to spawn the next object
		nextSpawnTime = Time.time+secondsBetweenSpawning;
	}

	// Update is called once per frame
	void Update ()
	{
		// exit if there is a game manager and the game is over
		if (GameManager.gm) {
			if (GameManager.gm.gameIsOver)
				return;
		}

		// if time to spawn a new game object
		if (Time.time  >= nextSpawnTime) {
			// Spawn the game object through function below
			MakeThingToSpawn ();

			// determine the next time to spawn the object
			nextSpawnTime = Time.time+secondsBetweenSpawning;
		}	
	}

	void MakeThingToSpawn ()
	{
		Vector2 spawnPosition;

		// get a random position between the specified ranges
		spawnPosition.x = Random.Range (xMinRange, xMaxRange);
		spawnPosition.y = Random.Range (yMinRange, yMaxRange);

		// determine which object to spawn
		int objectToSpawn = Random.Range (0, spawnObjects.Length);

		// actually spawn the game object
		GameObject spawnedObject = Instantiate (spawnObjects [objectToSpawn], spawnPosition, Quaternion.Euler(0,0,90)) as GameObject;

		// make the parent the spawner so hierarchy doesn't get super messy
		spawnedObject.transform.parent = gameObject.transform;
	}
}
