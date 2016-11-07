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

    private Vector3 lastPosition;

    void Start() {
        maxLeft = mapTileHorizontalUnits * (unitSize * -1f) + horizontalEdgeBuffer;
        maxRight = mapTileHorizontalUnits * unitSize - horizontalEdgeBuffer;
        maxTop = mapTileVerticalUnits * unitSize - verticalEdgeBuffer;
        maxBottom = mapTileVerticalUnits * (unitSize * -1f) + verticalEdgeBuffer;
    }
        
	void Update () {
        float playerX = PlayerCharacter.position.x;
        float playerY = PlayerCharacter.position.y;
        Vector3 newPosition = new Vector3(lastPosition.x, lastPosition.y, -10);

        if(playerX >= maxLeft && playerX <= maxRight) {
            newPosition.x = playerX;
        }

        if(playerY >= maxBottom && playerY <= maxTop) {
            newPosition.y = playerY;
        }
        
        transform.position = newPosition;
        lastPosition = newPosition;
	}
}
