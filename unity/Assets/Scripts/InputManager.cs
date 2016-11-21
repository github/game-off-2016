/*
 * The MIT License
 * 
 * Copyright (c) 2016, Takashi Kokawa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using System.Collections;

public class InputManager : MonoBehaviour {

	private KeyCode[] keyList = new KeyCode[] { KeyCode.A, KeyCode.S, KeyCode.D, KeyCode.F, KeyCode.G,
		KeyCode.H, KeyCode.J, KeyCode.K, KeyCode.L, KeyCode.Semicolon, KeyCode.Q, KeyCode.W,
		KeyCode.E, KeyCode.R, KeyCode.T, KeyCode.Y, KeyCode.U, KeyCode.I, KeyCode.O,
		KeyCode.P, KeyCode.Z, KeyCode.X, KeyCode.C, KeyCode.V, KeyCode.B, 
		KeyCode.N, KeyCode.M, KeyCode.Comma, KeyCode.Period, KeyCode.Slash};
	private Hashtable keyTable; 

	private BlockFactory bf;

	void Start() {
		keyTable = new Hashtable(keyList.Length);
		GameObject[] keyTexts = GameObject.FindGameObjectsWithTag("Key");
		bf = GameObject.FindGameObjectWithTag("BlockFactory").GetComponent<BlockFactory>();

		foreach( KeyCode key in keyList ) {
			//Debug.Log(key);
			foreach( GameObject obj in keyTexts ) {
				string buttonText = obj.GetComponent<Text>().text;
				if( buttonText.Equals( key.ToString() )) {
					//Debug.Log(key.ToString() + " : " + buttonText);
					// add parent (Button) Object.
					keyTable.Add( key, obj.transform.parent );
				} else if( buttonText.Equals(";") && key == KeyCode.Semicolon ) {
					//Debug.Log(key.ToString() + " : " + buttonText);
					keyTable.Add( key, obj.transform.parent );
				} else if( buttonText.Equals(",") && key == KeyCode.Comma ) {
					//Debug.Log(key.ToString() + " : " + buttonText);
					keyTable.Add( key, obj.transform.parent );
				} else if( buttonText.Equals(".") && key == KeyCode.Period ) {
					//Debug.Log(key.ToString() + " : " + buttonText);
					keyTable.Add( key, obj.transform.parent );
				} else if( buttonText.Equals("/") && key == KeyCode.Slash ) {
					//Debug.Log(key.ToString() + " : " + buttonText);
					keyTable.Add( key, obj.transform.parent );
				}
			}
		}
	}

	void Update () {
		/*
		if( Input.GetKeyDown(KeyCode.A) ) {
			Debug.Log("A :" + keyTable[KeyCode.A]);
			Transform buttonPos = (Transform)keyTable[KeyCode.A];
			GameObject block = bf.GetBlock();
			block.transform.position = buttonPos.position;
			block.GetComponent<BlockBehaviour>().StartShot(Vector3.right);
		}*/

		foreach( KeyCode key in keyList ) {
			if( Input.GetKeyDown(key) ) {
				Debug.Log( key.ToString() + " : " + keyTable[key]);
				Transform buttonPos = (Transform)keyTable[key];
				GameObject block = bf.GetBlock();
				block.transform.position = buttonPos.position;
				block.GetComponent<BlockBehaviour>().StartShot(GetShotVec(key));
			}
		}

		// Judge if symmetry
		if( Input.GetKeyDown(KeyCode.Return) ) {
			// とりあえず.
			int sceneIndex = SceneManager.GetActiveScene().buildIndex + 1;
			if( sceneIndex <= SceneManager.sceneCount ) {
				SceneManager.LoadScene(sceneIndex);
			} else {
				SceneManager.LoadScene(0);
			}
		}
	}


	private Vector3 GetShotVec( KeyCode key ) {

		if( key == KeyCode.A || key == KeyCode.S || key == KeyCode.D || key == KeyCode.F || key == KeyCode.G ) { 
			return Vector3.right;
		}
		if( key == KeyCode.Q || key == KeyCode.W || key == KeyCode.E || key == KeyCode.R || key == KeyCode.T
			|| key == KeyCode.Y || key == KeyCode.U || key == KeyCode.I || key == KeyCode.O || key == KeyCode.P ) { 
			return Vector3.down;
		}
		if( key == KeyCode.H || key == KeyCode.J || key == KeyCode.K || key == KeyCode.L || key == KeyCode.Semicolon ) { 
			return Vector3.left;
		}
		if( key == KeyCode.Z || key == KeyCode.X || key == KeyCode.C || key == KeyCode.V || key == KeyCode.B
			|| key == KeyCode.N || key == KeyCode.M || key == KeyCode.Comma || key == KeyCode.Period || key == KeyCode.Slash ) { 
			return Vector3.up;
		}
		return Vector3.zero;
	}
}
