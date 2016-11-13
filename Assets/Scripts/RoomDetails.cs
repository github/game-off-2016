using System.Collections.Generic;
using UnityEngine;

public class RoomDetails : MonoBehaviour {
    public int HorizontalSize;
    public int VerticalSize;
    public List<GameObject> Doors;

    void Start() {
        int doorIndex = 0;

        for(int i = 0; i < transform.childCount; i++) {
            GameObject child = transform.GetChild(i).gameObject;
            if (child.tag == "door") {
                Doors.Add(child);
                child.GetComponent<DoorDetails>().ID = doorIndex;
                doorIndex++;
            }
        }
    }
}
