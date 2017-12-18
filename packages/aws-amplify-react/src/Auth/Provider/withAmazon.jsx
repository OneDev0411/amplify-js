import React, { Component } from 'react';

import { Auth, Logger } from 'aws-amplify';
import AmplifyTheme from '../../AmplifyTheme';
import { SignInButton } from '../../AmplifyUI';

const logger = new Logger('withAmazon');

export default function withAmazon(Comp) {
    return class extends Component {
        constructor(props) {
            super(props);

            this.initAmazon = this.initAmazon.bind(this);
            this.signIn = this.signIn.bind(this);
            this.federatedSignIn = this.federatedSignIn.bind(this);

            this.state = {
                amz: null
            }
        }

        signIn() {
            const { amz } = this.state;
            const options = { scope: 'profile' };
            amz.Login.authorize(options, (response) => {
                if (response.error) {
                    logger.debug('Failed to login with amazon: ' + error);
                    return;
                }
                
                this.federatedSignIn(response);
            });
        }

        federatedSignIn(response) {
            const { access_token, expires_in } = response;
            const { onStateChange } = this.props;
            const date = new Date();
            const expires_at = expires_in * 1000 + date.getTime();
            if (!access_token) {
                return;
            }

            const { amz } = this.state;
            amz.Login.retrieveProfile((userInfo) => {
                if (!userInfo.success) {
                    logger.debug('Get user Info failed');
                    return;
                }

                const user = {
                    name: userInfo.profile.Name
                }

                Auth.federatedSignIn('amazon', { access_token, expires_at }, user)
                    .then(credentials => {
                        logger.debug('getting credentials');
                        logger.debug(credentials);
                        if (onStateChange) {
                            onStateChange('signedIn');
                        }
                    });
            });
        }

        componentDidMount() {
            this.createScript();
        }

        createScript() {
            const script = document.createElement('script');
            script.src = 'https://api-cdn.amazon.com/sdk/login1.js';
            script.async = true;
            script.onload = this.initAmazon;
            document.body.appendChild(script);
        }

        initAmazon() {
            logger.debug('init amazon');
            const { amazon_client_id } = this.props;
            const amz = window.amazon;
            this.setState({ amz });
            amz.Login.setClientId(amazon_client_id);
        }

        render() {
            const { amz } = this.state;
            return (
                <Comp {...this.props} amz={amz} amazonSignIn={this.signIn} />
            )
        }
    }
}

const Button = (props) => (
    <SignInButton
        id="amazon_signin_btn"
        onClick={props.amazonSignIn}
        theme={props.theme || AmplifyTheme}
    >
        Sign In with Amazon
    </SignInButton>
)

export const AmazonButton = withAmazon(Button);
