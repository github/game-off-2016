import UUID from "uuid"

export const BASE = "BASE";
export const NEUTRAL = "NEUTRAL";
export const CAPTURED = "CAPTURED";
export const ENEMY = "ENEMY";
export const ENEMY_CAPTURED = "ENEMY_CAPTURED";

export const BASE_PACKET_CREATION_RATE = 2500;

export default class {
  constructor(type) {
    this.type = type;
    this.uuid = UUID.v4();
    this.packets = 0
    this.packetCreationTimer = 0
    this.data = 0
    if (this.type == ENEMY) {
      this.data = 3;
    }
  }

  updateTimers(dt) {
    this.packetCreationTimer += dt
  }

  addPackets(count) {
    if (count === 0) return

    this.packets += count
    this.packetCreationTimer -= count * BASE_PACKET_CREATION_RATE
  }

  subtractPackets(count) {
    this.packets = Math.max(0, this.packets - count)
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
    return this.packets > 0 && !this.isEnemy()
  }

  canTransportPacket() {
    switch (this.type) {
    case NEUTRAL: return true
    case BASE: return true
    default: return false
    }
  }

  hit() {
    if (this.canTransportPacket()) {
      this.addPackets(1)
    }

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
    case BASE: return true;
    default: return false;
    }
  }
}
