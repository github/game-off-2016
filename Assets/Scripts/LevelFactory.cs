using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization.Formatters.Binary;
using System.IO;

public class LevelFactory : MonoBehaviour {

	public int roomCount;
	Room startingPoint;
	Room[] templates;

	LevelGenerator generator;

	void Start() {
		GenerateRooms (Managers.RoomNavigationManager.RoomPrefabs);
		generator = new LevelGenerator (startingPoint, templates, roomCount);
		generator.GenerateMap ();
	}

	void Update() {
		if (Input.GetKeyDown (KeyCode.Tab)) {
			DrawMap ();
		}
	}

	void GenerateRooms(GameObject[] prefabs) {
		templates = new Room[prefabs.Length];
		for (int i = 0; i < prefabs.Length; i++) {
			templates [i] = new Room (prefabs[i]);
		}
		startingPoint = templates [0];
	}

	void DrawMap() {
		Debug.Log("tab");
	}

}