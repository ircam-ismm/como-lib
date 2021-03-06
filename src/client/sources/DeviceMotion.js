import devicemotion from '@ircam/devicemotion';
import BaseSource from '../../common/sources/BaseSource';

class DeviceMotion extends BaseSource {
  constructor(como, streamId = null) {
    super();

    if (!como.hasDeviceMotion) {
      throw new Error('DeviceMotion source requires access to the device motion API');
    }

    if (streamId === null) {
      throw new Error('DeviceMotion source requires a streamId');
    }

    this.como = como;
    this.streamId = streamId;

    this.data = {
      metas: {},
      accelerationIncludingGravity: {},
      rotationRate: {},
    };

    this.process = this.process.bind(this);
  }

  addListener(callback) {
    super.addListener(callback);

    if (this.listeners.size === 1) {
      devicemotion.addEventListener(this.process);
    }
  }

  removeListener(callback) {
    super.removeListener(callback);

    if (this.listeners.size === 0) {
      devicemotion.removeEventListener(this.process);
    }
  }

  process(e) {
    const syncTime = this.como.experience.plugins['sync'].getSyncTime();

    // metas
    this.data.metas.id = this.streamId;
    this.data.metas.time = syncTime;
    this.data.metas.period = e.interval / 1000;
    // acceleration
    this.data.accelerationIncludingGravity.x = e.accelerationIncludingGravity.x;
    this.data.accelerationIncludingGravity.y = e.accelerationIncludingGravity.y;
    this.data.accelerationIncludingGravity.z = e.accelerationIncludingGravity.z;
    // rotation
    this.data.rotationRate.alpha = e.rotationRate.alpha;
    this.data.rotationRate.beta = e.rotationRate.beta;
    this.data.rotationRate.gamma = e.rotationRate.gamma;

    this.emit(this.data);
  }
}

export default DeviceMotion;
