import { TrackSide } from './types';

export interface TrackPoint {
  x: number;
  z: number;
  angle: number; // yaw rotation in radians
  side: TrackSide;
  tangentX: number;
  tangentZ: number;
}

export class TrackPath {
  public readonly xMin: number;
  public readonly xMax: number;
  public readonly zMin: number;
  public readonly zMax: number;
  public readonly radius: number;

  public readonly straightBottomLen: number;
  public readonly arcLen: number;
  public readonly straightRightLen: number;
  public readonly straightTopLen: number;
  public readonly straightLeftLen: number;
  public readonly totalLength: number;

  constructor(
    xMin = -3.8,
    xMax = 3.8,
    zMin = -3.8,
    zMax = 3.8,
    radius = 0.9
  ) {
    this.xMin = xMin;
    this.xMax = xMax;
    this.zMin = zMin;
    this.zMax = zMax;
    this.radius = radius;

    this.straightBottomLen = (xMax - radius) - (xMin + radius);
    this.straightRightLen = (zMax - radius) - (zMin + radius);
    this.straightTopLen = this.straightBottomLen;
    this.straightLeftLen = this.straightRightLen;

    this.arcLen = 0.5 * Math.PI * radius; // 90 degree arc length
    this.totalLength =
      this.straightBottomLen +
      this.arcLen +
      this.straightRightLen +
      this.arcLen +
      this.straightTopLen +
      this.arcLen +
      this.straightLeftLen +
      this.arcLen;
  }

  /**
   * Given progress t in [0, 1), returns world position (x, z) on track and orientation.
   * Path starts at bottom-left (dispenser exit) and moves counter-clockwise:
   * Bottom (moving +X) -> Bottom-Right Arc -> Right (moving -Z) -> Top-Right Arc ->
   * Top (moving -X) -> Top-Left Arc -> Left (moving +Z) -> Bottom-Left Arc.
   */
  public getPointAt(t: number): TrackPoint {
    let normalizedT = t % 1.0;
    if (normalizedT < 0) normalizedT += 1.0;

    let d = normalizedT * this.totalLength;

    const r = this.radius;
    const x0 = this.xMin + r;
    const x1 = this.xMax - r;
    const z0 = this.zMin + r;
    const z1 = this.zMax - r;

    // Segment 1: Bottom Straight (moving from x0 to x1 along z = zMax)
    if (d < this.straightBottomLen) {
      const frac = d / this.straightBottomLen;
      return {
        x: x0 + frac * (x1 - x0),
        z: this.zMax,
        angle: 0, // facing +X
        side: 'bottom',
        tangentX: 1,
        tangentZ: 0,
      };
    }
    d -= this.straightBottomLen;

    // Segment 2: Bottom-Right Corner (arc from (x1, z1 + r) to (x1 + r, z1))
    if (d < this.arcLen) {
      const theta = -Math.PI / 2 + (d / this.arcLen) * (Math.PI / 2);
      const tanX = Math.cos(theta + Math.PI / 2);
      const tanZ = -Math.sin(theta + Math.PI / 2);
      return {
        x: x1 + r * Math.cos(theta),
        z: z1 - r * Math.sin(theta),
        angle: Math.atan2(-tanZ, tanX),
        side: 'bottom',
        tangentX: tanX,
        tangentZ: tanZ,
      };
    }
    d -= this.arcLen;

    // Segment 3: Right Straight (moving from z1 to z0 along x = xMax towards -Z)
    if (d < this.straightRightLen) {
      const frac = d / this.straightRightLen;
      return {
        x: this.xMax,
        z: z1 - frac * (z1 - z0),
        angle: Math.PI / 2, // facing -Z: mouth forward!
        side: 'right',
        tangentX: 0,
        tangentZ: -1,
      };
    }
    d -= this.straightRightLen;

    // Segment 4: Top-Right Corner (arc from (x1 + r, z0) to (x1, z0 - r))
    if (d < this.arcLen) {
      const theta = 0 + (d / this.arcLen) * (Math.PI / 2);
      const tanX = -Math.sin(theta);
      const tanZ = -Math.cos(theta);
      return {
        x: x1 + r * Math.cos(theta),
        z: z0 - r * Math.sin(theta),
        angle: Math.atan2(-tanZ, tanX),
        side: 'top',
        tangentX: tanX,
        tangentZ: tanZ,
      };
    }
    d -= this.arcLen;

    // Segment 5: Top Straight (moving from x1 to x0 along z = zMin towards -X)
    if (d < this.straightTopLen) {
      const frac = d / this.straightTopLen;
      return {
        x: x1 - frac * (x1 - x0),
        z: this.zMin,
        angle: Math.PI, // facing -X: mouth forward!
        side: 'top',
        tangentX: -1,
        tangentZ: 0,
      };
    }
    d -= this.straightTopLen;

    // Segment 6: Top-Left Corner (arc from (x0, z0 - r) to (x0 - r, z0))
    if (d < this.arcLen) {
      const theta = Math.PI / 2 + (d / this.arcLen) * (Math.PI / 2);
      const tanX = -Math.sin(theta);
      const tanZ = -Math.cos(theta);
      return {
        x: x0 + r * Math.cos(theta),
        z: z0 - r * Math.sin(theta),
        angle: Math.atan2(-tanZ, tanX),
        side: 'left',
        tangentX: tanX,
        tangentZ: tanZ,
      };
    }
    d -= this.arcLen;

    // Segment 7: Left Straight (moving from z0 to z1 along x = xMin towards +Z)
    if (d < this.straightLeftLen) {
      const frac = d / this.straightLeftLen;
      return {
        x: this.xMin,
        z: z0 + frac * (z1 - z0),
        angle: -Math.PI / 2, // facing +Z: mouth forward!
        side: 'left',
        tangentX: 0,
        tangentZ: 1,
      };
    }
    d -= this.straightLeftLen;

    // Segment 8: Bottom-Left Corner (arc from (x0 - r, z1) to (x0, z1 + r))
    const theta = Math.PI + (d / Math.max(0.001, this.arcLen)) * (Math.PI / 2);
    const tanX = Math.cos(theta + Math.PI / 2);
    const tanZ = -Math.sin(theta + Math.PI / 2);
    return {
      x: x0 + r * Math.cos(theta),
      z: z1 - r * Math.sin(theta),
      angle: Math.atan2(-tanZ, tanX),
      side: 'bottom',
      tangentX: tanX,
      tangentZ: tanZ,
    };
  }

  /**
   * Generates sample points along the track for drawing conveyor meshes / arrows.
   */
  public generateTrackPolygonPoints(samples = 120): TrackPoint[] {
    const points: TrackPoint[] = [];
    for (let i = 0; i < samples; i++) {
      points.push(this.getPointAt(i / samples));
    }
    return points;
  }
}
