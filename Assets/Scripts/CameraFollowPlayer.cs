using UnityEngine;
using System.Collections;

public class CameraFollowPlayer : MonoBehaviour {
    public Transform PlayerCharacter;
    public float horizontalEdgeBuffer;
    public float verticalEdgeBuffer;
	
    private int mapTileHorizontalUnits = 4;
    private int mapTileVerticalUnits = 2;
    private float unitSize = 5;

    private float maxLeft;
    private float maxRight;
    private float maxTop;
    private float maxBottom;

    void Start() {
        maxLeft = mapTileHorizontalUnits * (unitSize * -1f) + horizontalEdgeBuffer;
        maxRight = mapTileHorizontalUnits * unitSize - horizontalEdgeBuffer;
        maxTop = mapTileVerticalUnits * unitSize - verticalEdgeBuffer;
        maxBottom = mapTileVerticalUnits * (unitSize * -1f) + verticalEdgeBuffer;
    }
        
	void Update () {
        float playerX = PlayerCharacter.position.x;
        float playerY = PlayerCharacter.position.y;

        if(playerX < maxLeft) {
            playerX = maxLeft;
        }

        if(playerX > maxRight) {
            playerX = maxRight;
        }

        if(playerY < maxBottom) {
            playerY = maxBottom;
        }

        if(playerY > maxTop) {
            playerY = maxTop;
        }

        Vector3 newPosition = new Vector3(playerX, playerY, -10);
        transform.position = newPosition;
	}
}
