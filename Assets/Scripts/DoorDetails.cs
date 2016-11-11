using UnityEngine;
using System.Collections;

public class DoorDetails : MonoBehaviour {
    public int Id;
    private int connectedRoomId;
    private int connectedDoorId;

    void OnCollisionEnter2D() {
        Debug.Log("collision detected, connecting to room " + connectedRoomId + " door " + connectedDoorId);
        Managers.RoomNavigationManager.ChangeRoom(connectedRoomId, connectedDoorId);
    }

    public void SetConnectedDoor(int roomId, int doorId) {
        connectedRoomId = roomId;
        connectedDoorId = doorId;
    }
}
