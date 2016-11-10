using UnityEngine;
using System.Collections;

public class Managers : MonoBehaviour {
    public static RoomNavigationManager RoomNavigationManager { get; set; }

	void Awake () {
        RoomNavigationManager = GetComponent<RoomNavigationManager>();
	}
}
