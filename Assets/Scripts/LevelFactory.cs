using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization.Formatters.Binary;
using System.IO;

public class LevelFactory : MonoBehaviour {

	public int roomCount;
	Room startingPoint;
	Room[] templates;

	List<LineRenderer> mapLineRenderers = new List<LineRenderer>();
	HashSet<int> drawnRoomIds = new HashSet<int> ();

	LevelGenerator generator;

	void Start() {
		GenerateRooms (Managers.RoomNavigationManager.RoomPrefabs);
		generator = new LevelGenerator (startingPoint, templates, roomCount);
		generator.GenerateMap ();
		DrawMap ();
	}

	void Update() {
		if (Input.GetKeyDown ("tab")) {
			foreach (LineRenderer renderer in mapLineRenderers) {
				renderer.enabled = true;
			}
		}
		if (Input.GetKeyUp ("tab")) {
			foreach (LineRenderer renderer in mapLineRenderers) {
				renderer.enabled = false;
			}
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
		DrawRoom (startingPoint);
	}

	void DrawRoom(Room room) {
		if (drawnRoomIds.Contains(room.roomId)) {
			return;
		}
		drawnRoomIds.Add (room.roomId);

		DrawLine (
			new Vector3 (room.LeftX(), startingPoint.TopY(), 0), 
			new Vector3 (room.LeftX(), startingPoint.BottomY(), 0), 
			Color.gray
		); 

		DrawLine (
			new Vector3 (room.RightX(), startingPoint.TopY(), 0), 
			new Vector3 (room.RightX(), startingPoint.BottomY(), 0), 
			Color.gray
		); 

		DrawLine (
			new Vector3 (room.LeftX(), startingPoint.TopY(), 0), 
			new Vector3 (room.RightX(), startingPoint.TopY(), 0), 
			Color.gray
		); 

		DrawLine (
			new Vector3 (room.LeftX(), startingPoint.BottomY(), 0), 
			new Vector3 (room.RightX(), startingPoint.BottomY(), 0), 
			Color.gray
		); 

		for (int i = 0; i < room.doors.Count; i++) {
			Door door = room.doors [i+1];
			if (room.doorsWithConnection.Contains (door)) {

				int doorStartX = room.LeftX () + door.x;
				int doorStartY = room.TopY () + door.y;
				int doorEndX = doorStartX;
				int doorEndY = doorStartY;

				if (door.x == 0 || door.x == room.width) {
					doorEndX += 5;
				} else {
					doorEndY += 5;
				}

				DrawLine (
					new Vector3 (doorStartX, doorStartY, 0), 
					new Vector3 (doorEndX, doorEndY, 0), 
					Color.green
				); 

				DrawRoom (door.connectedRoom);
			}
		}
	}

	void DrawLine(Vector3 start, Vector3 end, Color color)
	{
		start.Scale(new Vector3(0.1f, 0.1f, 1f));
		end.Scale(new Vector3(0.1f, 0.1f, 1f));

		GameObject myLine = new GameObject();
		myLine.transform.position = start;
		myLine.AddComponent<LineRenderer>();
		LineRenderer lr = myLine.GetComponent<LineRenderer>();
		lr.material = new Material(Shader.Find("Particles/Alpha Blended Premultiply"));
		lr.SetColors(color, color);
		lr.SetWidth(0.1f, 0.1f);
		lr.SetPosition(0, start);
		lr.SetPosition(1, end);
		lr.enabled = false;

		mapLineRenderers.Add (lr);
	}

}