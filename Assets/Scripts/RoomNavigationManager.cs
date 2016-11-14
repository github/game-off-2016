using UnityEngine;
using System.Collections;

public class RoomNavigationManager : MonoBehaviour {
    public GameObject PlayerGameObject;
    public GameObject[] RoomPrefabs;

    private GameObject activeRoomPrefab;
    
    void Awake() {
        activeRoomPrefab = Instantiate(RoomPrefabs[0]);
        activeRoomPrefab.GetComponent<RoomDetails>().Doors[0].GetComponent<DoorDetails>().SetConnectedDoor(1, 1);
    }

    // Change room prefab
    public void ChangeRoom(int connectedRoomId, int connectedDoorId) {
        // remove current room prefab from scene
        Destroy(activeRoomPrefab);

        // spawn connectedRoom and save reference
        activeRoomPrefab = Instantiate(GetRoomPrefabById(connectedRoomId));
        
        // find position of connected door
        Vector3 connectedDoorPosition = GetDoorPosition(connectedDoorId);

        // determin if player should be on the left or right side of the door's location
        bool spawnCharacterOnLeftOfDoor = isDoorOnRight(connectedDoorPosition);

        // position player slightly off of door's location
        float characterOffsetX = 2f;

        if (spawnCharacterOnLeftOfDoor) {
            characterOffsetX *= -1;
        }

        PlayerGameObject.transform.localPosition = new Vector3(connectedDoorPosition.x + characterOffsetX, connectedDoorPosition.y, 0);
    }

    // assumes that a valid ID is provided, if not bad things will happen
    GameObject GetRoomPrefabById(int id) {
        // loop through all the room prefabs
        foreach(GameObject room in RoomPrefabs) {
            if(room.GetComponent<RoomDetails>().Id == id) {
                return room;
            }
        }

        return new GameObject();
    }

    // assumes that a valid ID is provided, if not bad things will happen
    Vector3 GetDoorPosition(int doorId) {
        Vector3 doorPosition = Vector3.zero;

        foreach(GameObject door in activeRoomPrefab.GetComponent<RoomDetails>().Doors) {
            if(door.GetComponent<DoorDetails>().Id == doorId) {
                doorPosition = door.transform.position;
            }
        }

        return doorPosition;
    }

    bool isDoorOnRight(Vector3 doorPosition) {
        if(doorPosition.x > 0) {
            return true;
        }

        return false;
    }
}
 