using UnityEngine;

public class DoorDetails : MonoBehaviour {
    public int ID;

    void OnCollisionEnter2D() {
        Managers.RoomNavigationManager.ChangeRoom(ID);
    }
}
