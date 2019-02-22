// tslint:disable
/*
 * Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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
// tslint:enable
import { I18n } from '@angular/core';

export default [
  {
    label: I18n.get('Username'),
    key: 'username',
    required: false,
    displayOrder: 1
  },
  {
    label: I18n.get('Password *'),
    key: 'password',
    required: true,
    type: 'password',
    displayOrder: 2,
  },
  {
    label: I18n.get('Email *'),
    key: 'email',
    required: true,
    type: 'email',
    displayOrder: 3
  },
  {
    label: I18n.get('Phone Number *'),
    key: 'phone_number',
    required: true,
    displayOrder: 4
  }
];
