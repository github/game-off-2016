using System;
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[Serializable]
public class Room {
	public int roomId;
	int width;
	int height;

	public Dictionary<int, Door> doors;
	public HashSet<Door> doorsWithConnection;
	public HashSet<Door> doorsWithoutConnection;

	public int startX = 0;
	public int startY = 0;
	bool inMap = false;

	public GameObject prefab;

	public Room(GameObject _prefab) {
		doorsWithConnection = new HashSet<Door>();
		doorsWithoutConnection = new HashSet<Door>();

		prefab = _prefab;
		RoomDetails roomDetail = prefab.GetComponent<RoomDetails> ();

		width = roomDetail.HorizontalSize;//((RectTransform)prefab.transform).rect.width;
		height = roomDetail.VerticalSize;//((RectTransform)prefab.transform).rect.height;

		GameObject[] prefabDoors = roomDetail.Doors;
		doors = new Dictionary<int, Door> ();
		int i = 1;
		foreach(GameObject doorObject in prefabDoors) {
			Door door = new Door(
				i,
				(int) doorObject.transform.localPosition.x,
				(int) doorObject.transform.localPosition.y
			);
			doors[i] = door;
			doorsWithoutConnection.Add(door);
			i ++;
		}
	}

	public void SetAsStartingPoint() {
		inMap = true;
	}

	public void SetDoorAsConnected(Door door) {
		doorsWithoutConnection.Remove (door);
		doorsWithConnection.Add (door);
	}

	public void SetDoorAsNotConnected(Door door) {
		doorsWithConnection.Remove (door);
		doorsWithoutConnection.Add (door);
	}

	public int TopX() {
		return startX;
	}

	public int BottomX() {
		return startX + height;
	}

	public int LeftY() {
		return startY;
	}

	public int RighyY() {
		return startX + width;
	}
		

	public static void ConnectDoors(Room room, Door door, Room newRoom, Door otherDoor) {
		if (room.doorsWithConnection.Contains (door)) {
			throw new Exception ("Door is already connected to an other room");
		}
		door.connectedRoomId = newRoom.roomId;
		door.connectedDoorId = otherDoor.doorId;

		otherDoor.connectedRoomId = room.roomId;
		otherDoor.connectedDoorId = door.doorId;

		room.SetDoorAsConnected (door);
		newRoom.SetDoorAsConnected (otherDoor);

		newRoom.startX = room.startX + door.x - otherDoor.x;
		newRoom.startY = room.startY + door.y - otherDoor.y;			
	}

	public static bool AreRoomsOverlapping(Room room1, Room room2) {
		if (room1.TopX () <= room2.TopX () && room1.BottomX () >= room2.TopX()) {
			return true;
		}

		if (room1.TopX () <= room2.BottomX () && room1.BottomX () >= room2.BottomX()) {
			return true;
		}

		if (room1.LeftY () <= room2.LeftY () && room1.RighyY () >= room2.LeftY()) {
			return true;
		}

		if (room1.LeftY () <= room2.RighyY () && room1.RighyY () >= room2.RighyY()) {
			return true;
		}

		if (room1.TopX () >= room2.TopX () && room1.BottomX () <= room2.BottomX () && room1.LeftY () >= room2.LeftY () && room1.RighyY () <= room2.RighyY ()) {
			return true;
		}

		return false;
	}
}