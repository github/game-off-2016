import UUID from "uuid"

export const BASE = "BASE";
export const NEUTRAL = "NEUTRAL";
export const CAPTURED = "CAPTURED";
export const ENEMY = "ENEMY";
export const ENEMY_CAPTURED = "ENEMY_CAPTURED";

export const BASE_PACKET_CREATION_RATE = 2500

export default class {
  constructor(type) {
    this.type = type;
    this.uuid = UUID.v4();
    this.packets = 0
    this.packetCreationTimer = 0
  }

  updateTimers(dt) {
    this.packetCreationTimer += dt
  }

  addPackets(count) {
    if (count === 0) return

    this.packets += count
    this.packetCreationTimer -= count * BASE_PACKET_CREATION_RATE
  }

  getPacketsToBeCreated() {
    return Math.floor(this.packetCreationTimer / BASE_PACKET_CREATION_RATE)
  }

  color() {
    switch (this.type) {
      case BASE: return 0x00DD00;
      case CAPTURED: return 0x00FFAA;
      case NEUTRAL: return 0xAAAAAA;
      case ENEMY: return 0xDD0000;
      case ENEMY_CAPTURED: return 0xFF4400;
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

  isPacketCreator() {
    switch (this.type) {
      case ENEMY: return true;
      case BASE: return true;
      default: return false;
    }
  }
}
