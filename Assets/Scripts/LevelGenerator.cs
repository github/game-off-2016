using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization.Formatters.Binary;
using System.IO;

public class LevelGenerator {

	int roomLimit;
	Room startingPoint;
	Room[] templates;

	int roomCount = 1;

	public LevelGenerator(Room _startingPoints, Room[] _templates, int limit) {
		templates = _templates;
		roomLimit = limit;
		startingPoint = _startingPoints;
	}

	public void GenerateMap() {
		Room.ConnectDoors (startingPoint, startingPoint.doors [1], templates [1], templates [1].doors [2]);
	}

	public static T DeepClone<T>(T obj)
	{
		using (var ms = new MemoryStream())
		{
			var formatter = new BinaryFormatter();
			formatter.Serialize(ms, obj);
			ms.Position = 0;

			return (T) formatter.Deserialize(ms);
		}
	}

}
