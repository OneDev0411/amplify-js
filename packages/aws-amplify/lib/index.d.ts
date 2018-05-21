import Analytics, { AnalyticsClass, AnalyticsProvider, AWSPinpointProvider, AWSKinesisProvider } from './Analytics';
import Auth, { AuthClass } from './Auth';
import Storage, { StorageClass } from './Storage';
import API, { APIClass, graphqlOperation } from './API';
import PubSub from './PubSub';
import Cache from './Cache';
import { ConsoleLogger as Logger, Hub, JS, ClientDevice, Signer, I18n, Amplify, ServiceWorker } from './Common';
export default Amplify;
<<<<<<< HEAD
export { Auth, Analytics, Storage, API, PubSub, I18n, Logger, Hub, Cache, JS, ClientDevice, Signer };
export { AuthClass, AnalyticsClass, APIClass, StorageClass, AnalyticsProvider, AWSPinpointProvider, AWSKinesisProvider };
=======
export { Auth, Analytics, Storage, API, PubSub, I18n, Logger, Hub, Cache, JS, ClientDevice, Signer, ServiceWorker };
export { AuthClass, AnalyticsClass, APIClass, StorageClass, AnalyticsProvider };
>>>>>>> analytics-refactor
export { graphqlOperation };
