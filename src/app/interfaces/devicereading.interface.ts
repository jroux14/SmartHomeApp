export class shDeviceReading {
  timestamp: string;
  metadata: {
    device: string;
    name: string;
    type: string;
  };
  value: number;

  constructor(timestamp: string, metadata: {device: string, name: string, type: string}, value: number) {
    this.timestamp = timestamp;
    this.metadata = metadata;
    this.value = value;
  }
}
