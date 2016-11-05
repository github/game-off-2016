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

public class BlockBehaviour : MonoBehaviour {

	private bool onShot = false;
	private float shotSpeed = 0.3f;
	private Vector3 shotVec = Vector3.zero;

	public void StartShot( Vector3 vec ) {
		onShot = true;
		shotVec = vec;
		gameObject.GetComponent<Rigidbody2D>().isKinematic = false;
	}
	
	void Update () {
		if( onShot ) {
			transform.Translate( shotVec * shotSpeed);
		}	
	}

	void OnCollisionEnter2D( Collision2D coll ) {
		Debug.Log("Stop");
		onShot = false;
		gameObject.GetComponent<Rigidbody2D>().isKinematic = true;
	}
	void OnTriggerEnter2D( Collider2D other ) {
		Debug.Log("Stop");
		onShot = false;
	}
}
