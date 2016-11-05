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
using System.Collections;

public class BlockFactory : MonoBehaviour {

	// Block prefab
	public GameObject blockPrefab;

	private int initialInstanciateNum = 200;
	private ArrayList blocks;

	// out of game field
	private Vector3 tempPos = new Vector3( 3000.0f, 0.0f, 0.0f );

	private GameObject uiRoot;
	private GameObject uiTemp;

	void Start() {
		uiRoot = GameObject.FindGameObjectWithTag("UIRoot");
		uiTemp = GameObject.FindGameObjectWithTag("UITemp");

		blocks = new ArrayList(initialInstanciateNum);
		for( int i = 0; i < initialInstanciateNum; ++i ) {
			GameObject block = (GameObject)GameObject.Instantiate(blockPrefab, uiTemp.transform);
			block.transform.position = tempPos;
			block.transform.localScale = Vector3.one;
			blocks.Add( block );
		}
	}

	public GameObject GetBlock() {
		GameObject block = (GameObject)blocks[0];
		blocks.RemoveAt(0); // remove from factory.
		block.transform.SetParent(uiRoot.transform);
		return block;
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
