import UUID from "uuid"

export const BASE = "BASE";
export const NEUTRAL = "NEUTRAL";
export const CAPTURED = "CAPTURED";
export const ENEMY = "ENEMY";
export const ENEMY_CAPTURED = "ENEMY_CAPTURED";

export default class {
  constructor(type) {
    this.type = type;
    this.uuid = UUID.v4();
  }

  color() {
    switch (this.type) {
      case BASE: return 0x00FF00;
      case CAPTURED: return 0x00BB00;
      case NEUTRAL: return 0xAAAAAA;
      case ENEMY: return 0xFF0000;
      case ENEMY_CAPTURED: return 0xAA0000;
    }
  }

  canSendPacket() {
    switch (this.type) {
      case BASE: return true;
      case CAPTURED: return true;
      case NEUTRAL: return false;
      case ENEMY: return false;
      case ENEMY_CAPTURED: return false;
    }
  }

  hit() {
    switch (this.type) {
      case NEUTRAL:
        this.type = CAPTURED;
        return
    }
  }

  isEnemy() {
    switch (this.type) {
      case ENEMY: return true;
      case ENEMY_CAPTURED: return true;
      default: return false;
    }
  }
}
