
let arDroneConstants = require('ar-drone/lib/constants');

export class MissionsExecutor {

  constructor(private client: any) {
    // From the SDK.
    let navdata_options = (
        this.navdata_option_mask(arDroneConstants.options.DEMO)
      | this.navdata_option_mask(arDroneConstants.options.VISION_DETECT)
      | this.navdata_option_mask(arDroneConstants.options.MAGNETO)
      | this.navdata_option_mask(arDroneConstants.options.WIFI)
    );

    this.client.config('general:navdata_demo', true);
    this.client.config('general:navdata_options', navdata_options);
    this.client.config('video:video_channel', 1);
    this.client.config('detect:detect_type', 12);
  }

  private navdata_option_mask(c) {
    return 1 << c;
  }
}
