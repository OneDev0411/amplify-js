/*
 * Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
import { Component } from '@angular/core';
import { SumerianSceneLoadingComponentCore } from './sumerian-scene-loading.component.core';

const template = `
<div class={{AmplifyUI.loadingOverlay}}>
  <div class={{AmplifyUI.loadingContainer}}>
    <div class={{AmplifyUI.loadingLogo}}>
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 2000 1195" style="enable-background:new 0 0 2000 1195;" xml:space="preserve">
        <g>
          <path class="st0" d="M1026.8,146.2c-0.7,2.3-1.2,3.7-1.6,5.1C991.8,291,958.5,430.6,925,570.3c-1.6,6.7-3.8,13.3-6.2,19.7
            c-3.9,10.4-12,16.3-22.8,16.5c-26.3,0.5-52.6,0.5-78.9,0c-9.5-0.2-17.3-5.3-21.2-14.2c-4.1-9.2-7.6-18.7-10.6-28.3
            c-51-167.3-101.9-334.6-152.7-502c-2.5-8.4-4.7-16.9-6.2-25.5c-2-11.7,3.8-18.9,15.5-19c24.6-0.2,49.2,0.1,73.8,0.4
            c12,0.2,21.1,5.9,24.8,17.3c5.4,16.3,10.1,32.8,14.4,49.4c33.9,133.3,67.7,266.6,101.5,399.9c0.3,1.3,0.8,2.6,1.5,5
            c0.7-2,1.3-3,1.5-4.1c19.9-84.2,39.7-168.4,59.6-252.7c14.5-61.3,28.9-122.6,43.4-183.8c0.9-3.6,2.1-7.1,3.2-10.6
            c4-13.2,13.5-19.8,26.6-20.1c24.1-0.6,48.2-0.5,72.3,0c12.6,0.2,21.5,7.2,25.1,19.2c3.9,12.9,7.1,26,10.1,39.1
            c32.5,137.8,65,275.6,97.5,413.4c0.3,1.4,0.8,2.8,1.7,5.7c1.7-6.1,3-10.7,4.2-15.3c36.8-142.6,73.6-285.2,110.5-427.8
            c1.4-5.5,3.7-10.8,5.7-16.2c4.5-12,13.8-17.8,26.1-18.1c21.7-0.6,43.5-0.5,65.2-0.7c2.2,0,4.4,0,6.6,0.3c9.9,1,14.9,5.9,14.3,15.9
            c-0.4,7.5-1.8,15.1-4.1,22.3c-33.5,107.9-67.2,215.6-100.9,323.5c-20.5,65.7-41,131.4-61.6,197.1c-1.3,4-2.8,7.9-4.3,11.9
            c-4.9,12.9-14.9,19.1-28.1,19.4c-23.9,0.5-47.9,0.4-71.8,0c-13.6-0.2-23.3-7.1-27.2-20.2c-4.5-15.5-8.3-31.2-12.1-46.9
            c-31.2-129.6-62.3-259.3-93.4-388.9C1028,150.1,1027.5,148.7,1026.8,146.2z"/>
          <path class="st0" d="M995.7,1194.2c-23.1,0-46.2,0.8-69.3-0.2c-25.4-1.1-50.7-3.5-76-5.7c-77.9-7-154.6-20.9-230.3-40.5
            c-68.1-17.6-134.6-40.1-199.4-67.3C330.7,1042.5,245.3,996,164.5,941c-53.7-36.6-104.7-76.7-153-120.1c-3.5-3.1-6.6-6.8-9-10.8
            c-3.5-5.8-3.4-12.1,0.8-17.5c4.3-5.6,10.5-7.4,17.2-5.7c4.5,1.2,8.8,3.3,12.9,5.5c42.2,22.1,83.9,45.3,126.7,66.4
            c63.2,31.2,128.6,57.4,195.1,80.8c68.4,24,137.7,44.8,208.4,60.6c48.4,10.8,97.2,19.9,146,28.7c29.8,5.3,59.9,8.8,89.9,12.3
            c23.4,2.7,46.9,4.6,70.3,6.3c22.8,1.7,45.7,3.3,68.5,4c39.8,1.1,79.5,2.1,119.3,1.8c29.9-0.2,59.9-2,89.8-4
            c26.2-1.7,52.4-3.7,78.4-7.1c46.8-6.2,93.6-12.7,140.1-20.9c99-17.3,196-42.9,290.8-76.1c40.7-14.3,80.6-30.6,120.8-46.1
            c12-4.6,23.6-5.4,34.7,2c11.5,7.7,15.3,22.7,7.6,34.2c-4,6-9.6,11.4-15.4,15.7c-81,59.3-169.6,104.7-262.8,141.3
            c-77,30.2-156,53.6-237,70.3c-37.9,7.8-76.1,13.8-114.3,19.6c-24.7,3.7-49.7,6-74.7,8.2c-22.1,1.9-44.3,3.3-66.5,4.1
            c-17.8,0.7-35.7,0.1-53.6,0.1C995.7,1194.3,995.7,1194.2,995.7,1194.2z"/>
          <path class="st0" d="M1714.8,0c39.2,0.9,85.7,8.5,130.2,26.1c9.3,3.7,17.9,9.3,26.1,15.1c9,6.4,13.3,15.9,13.4,27.1
            c0,12,0.1,23.9,0,35.9c0,2.5-0.4,5.1-1,7.5c-2.1,8.7-7.4,12.7-16.2,11.4c-5.7-0.9-11.6-2.6-16.8-5c-46.6-21.8-95.9-30.1-147-28.3
            c-21.5,0.8-42.6,3.5-62.7,11.9c-37.6,15.6-54.4,54.2-39.7,91c7.1,17.8,21.1,28.8,37.3,37.7c21.4,11.8,44.5,19.1,67.6,26.5
            c31.6,10,63.3,19.7,94.6,30.6c28.5,9.9,55.1,24,76.4,46.1c23.3,24.1,36.4,53.2,39.9,86.5c9.1,86.7-40.5,150.8-109.3,180.7
            c-38.9,16.8-79.7,24.4-122,24.6c-56.9,0.2-112-9.7-164.9-30.7c-9.4-3.8-18.3-9.3-26.9-14.8c-9.7-6.2-13.6-16.1-13.9-27.3
            c-0.4-13-0.3-26-0.1-38.9c0.3-14.9,8.1-21.1,22.5-17.3c8.2,2.2,16.2,5.6,24.1,9c52.7,22.5,107.7,31.7,164.8,29.6
            c24.9-0.9,49.4-4.7,72-16c29.7-14.9,45.7-38.5,44.5-72.4c-0.9-23.7-11.9-41.7-31.7-54.4c-17.2-10.9-36.1-18-55.4-24.1
            c-36.4-11.5-73.1-22.4-109.3-34.6c-30.8-10.4-58.7-26.2-81.4-50.2c-43.4-45.8-56.3-116.8-30.6-172.5c18.1-39.3,48.5-66.6,86.9-85.5
            C1624,6.4,1664.5,0,1714.8,0z"/>
          <path class="st0" d="M1860.6,746.5c33.3,0.4,66.3,2.8,98.5,11.6c8.4,2.3,16.5,5.8,24.6,9.1c7.5,3.1,11.9,9.2,13.5,17.2
            c2.5,12.2,3.1,24.5,2.5,37.1c-1.2,24-5,47.5-10.5,70.8c-12.3,51.3-31.6,99.8-60.1,144.4c-16.5,25.9-36,49.3-59.4,69.2
            c-5.2,4.4-10.7,8.3-17.9,8.4c-6.8,0-10.7-3.5-10.3-10.2c0.2-4.1,1.3-8.3,2.9-12.1c17-42.7,33.7-85.6,47-129.7
            c7.6-25.2,14.3-50.6,16.5-76.9c0.7-8.8,0.1-17.9-1.1-26.7c-1.6-12-9.3-19.8-20.2-24.6c-12.5-5.4-25.8-8.2-39.2-9.1
            c-18.6-1.3-37.4-2.3-56-2c-20.7,0.4-41.3,2.1-62,3.7c-18.8,1.4-37.5,3.3-56.3,5.2c-9.9,1-19.7,2.4-29.5,3.6c-1,0.1-2,0.4-3,0.3
            c-4.8-0.2-9.7-0.8-12.4-5.4c-2.7-4.6-1.8-9.7,1.5-13.2c5.1-5.5,10.6-10.8,16.9-14.9c36.4-24,76.8-38.4,119.4-46.2
            c22.1-4,44.6-5.9,67-8.3C1842.1,746.9,1851.4,746.9,1860.6,746.5z"/>
          <path class="st0" d="M591.6,541.4c-21.4-36.5-29.7-76.2-29.7-117.9c-0.1-70.3,0.1-140.6-0.1-211c-0.1-29.6-3.8-58.8-13-87.1
            c-15.6-48-45.4-83.2-92.4-102.9C424.8,9.3,391.7,3.9,357.9,2c-63.7-3.6-125.3,6.4-184.7,29.3c-11.7,4.5-23,10.3-34.3,16
            c-11.6,5.8-17.3,15.4-17.1,28.6c0.2,12.6-0.1,25.3,0,37.9c0,2.9,0.1,5.8,0.7,8.5c2,9.5,7.9,13.7,17.3,11.2c8.4-2.2,16.8-5,24.9-8.2
            c40.4-15.9,81.7-28.9,125.3-32.1c29.7-2.2,59.3-1.4,88.3,6.5c24.2,6.6,44.8,18.5,57.2,41.5c10.1,18.6,15.1,38.7,16.1,59.5
            c1.3,24.7,1,49.5,1.4,74.3c0,0.8-0.2,1.6-0.3,2.8c-16.1-3.3-31.5-6.6-47.1-9.5c-46.9-8.6-94.1-13.2-141.8-7.7
            c-33.5,3.9-65.4,12.9-94.4,30.5c-37.4,22.6-64.8,53.5-78.2,95.7c-10.9,34.3-11.9,69.4-4.4,104.4c12,56.1,44.4,96,97.9,117.4
            c41.8,16.6,85.2,17.2,128.9,9.5c57.4-10.1,104-39.3,142.3-82.5c1.3-1.5,2.7-2.9,4.3-4.8c1.7,3.4,3.1,6.2,4.5,9
            c10.4,21.4,22.2,42,38.5,59.7c11.2,12.1,24,14.5,37.5,5.8c14.5-9.3,28.8-18.8,42.9-28.6C597.7,567,600.3,556.1,591.6,541.4z
              M448.3,436.2c-7.1,29.5-25.4,50.8-49.1,68.2c-22,16.2-47.4,23.8-73.8,28.5c-20.7,3.6-41.6,4.4-62.3-0.2
            c-35.6-8-59.6-35.5-63.5-72.3c-2.3-21.9-1.9-43.5,7-64.1c11.9-27.6,34-43.2,61.9-51.5c21.4-6.4,43.4-7.9,63.7-7.5
            c41.1,0.2,79.8,5.3,117.9,14.4c1.6,0.4,4.1,2.4,4.1,3.7C454.7,382.5,454.7,409.6,448.3,436.2z"/>
        </g>
      </svg>
    </div>
    <div class={{AmplifyUI.loadingSceneName}}>{{sceneName}}</div>
    <div class={{AmplifyUI.loadingBar}}>
      <div class={{AmplifyUI.loadingBarFill}} [ngStyle]="{ 'width': loadPercentage + '%' }"></div>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'sumerian-scene-loading-ionic',
  template,
  styleUrls: ['/node_modules/@aws-amplify/ui/src/XR.css']
})
export class SumerianSceneLoadingComponentIonic extends SumerianSceneLoadingComponentCore {
  constructor() {
    super();
  }
}
