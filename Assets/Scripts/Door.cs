using System;
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[Serializable]
public class Door {
	public int doorId;
	public int x;
	public int y;
	public int connectedRoomId;
	public int connectedDoorId;

	public Door(int id, int _x, int _y) {
		doorId = id;
		x = _x;
		y = _y;
	}
}