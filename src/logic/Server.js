export const BASE = "BASE";
export const NEUTRAL = "NEUTRAL";
export const CAPTURED = "CAPTURED";

export default class {
  constructor(type) {
    this.type = type
  }

  color() {
    switch (this.type) {
      case BASE: return 0x00FF00;
      case CAPTURED: return 0x00BB00;
      case NEUTRAL: return 0xAAAAAA;
    }
  }

  canSendPacket() {
    switch (this.type) {
      case BASE: return true;
      case CAPTURED: return true;
      case NEUTRAL: return false;
    }
  }

  hit() {
    switch (this.type) {
      case NEUTRAL:
        this.type = CAPTURED;
        return
    }
  }
}
