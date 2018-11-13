class Fingerprint {
  static userAgent() {
    return undefined;
  }

  static language() {
    return undefined;
  }

  static colorDepth() {
    return undefined;
  }

  static deviceMemory() {
    return undefined;
  }

  static pixelRatio() {
    return undefined;
  }

  static hardwareConcurrency() {
    return undefined;
  }

  static screenResolution() {
    return undefined;
  }

  static availableScreenResolution() {
    return undefined;
  }

  static timezoneOffset() {
    return undefined;
  }

  static timezone() {
    return undefined;
  }

  static sessionStorage() {
    return undefined;
  }

  static localStorage() {
    return undefined;
  }

  static indexedDb() {
    return undefined;
  }

  static addBehavior() {
    return undefined;
  }

  static openDatabase() {
    return undefined;
  }

  static cpuClass() {
    return undefined;
  }

  static platform() {
    return undefined;
  }

  static doNotTrack() {
    return undefined;
  }

  static plugins() {
    return undefined;
  }

  static canvas() {
    return undefined;
  }

  static webgl() {
    return undefined;
  }

  static webglVendorAndRenderer() {
    return undefined;
  }

  static adBlock() {
    return undefined;
  }

  static touchSupport() {
    return undefined;
  }

  static fonts() {
    return undefined;
  }

  static audio() {
    return undefined;
  }

  static enumerateDevice() {
    return undefined;
  }

  static get() {
    const components = {
      userAgent: this.userAgent(),
      language: this.language(),
      colorDepth: this.colorDepth(),
      deviceMemory: this.deviceMemory(),
      pixelRatio: this.pixelRatio(),
      hardwareConcurrency: this.hardwareConcurrency(),
      screenResolution: this.screenResolution(),
      availableScreenResolution: this.availableScreenResolution(),
      timezoneOffset: this.timezoneOffset(),
      timezone: this.timezone(),
      sessionStorage: this.sessionStorage(),
      localStorage: this.localStorage(),
      indexedDb: this.indexedDb(),
      addBehavior: this.addBehavior(),
      openDatabase: this.openDatabase(),
      cpuClass: this.cpuClass(),
      platform: this.platform(),
      doNotTrack: this.doNotTrack(),
      plugins: this.plugins(),
      canvas: this.canvas(),
      webgl: this.webgl(),
      webglVendorAndRenderer: this.webglVendorAndRenderer(),
      adBlock: this.adBlock(),
      touchSupport: this.touchSupport(),
      fonts: this.fonts(),
      audio: this.audio(),
      enumerateDevice: this.enumerateDevice(),
    };

    Object.keys(components).forEach((key) => {
      if (components[key] === undefined) {
        components[key] = 'unknown';
      }
    });

    return components;
  }
}

export default Fingerprint;
