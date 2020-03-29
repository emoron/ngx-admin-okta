/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { Router } from '@angular/router';
import * as OktaAuth from '@okta/okta-auth-js';
import { authConfig } from './oauth2.config';
import { of as observableOf } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  // URL to redirect after logging in
  redirectUrl: string;

  private authClient: any;

  constructor(private oauthService: OAuthService, private router: Router) {

    this.authClient = new OktaAuth(
      {
        url: `${environment.auth.url}`,
        issuer: `${environment.auth.url}/oauth2/${environment.auth.issuer}`,
      }
    );

  }

  configureWithNewConfigApi() {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  /**
   * A Promise is an object representing the eventual completion or failure of an asynchronous operation.
   */
  login(username: string, password: string): Promise<any> {

    return this.oauthService.loadDiscoveryDocument().then((doc) => {
      return this.oauthService.createAndSaveNonce().then(nonce => {
        /** Primary Authentication https://${yourOktaDomain}/api/v1/authn
         * POST /api/v1/authn
         * Every authentication transaction starts with primary authentication which validates a user’s primary password credential. 
         * The goal is to get an Okta session token (sessionToken) or cookie
         */
        return this.authClient.signIn({
          username: username,
          password: password
        }).then((response) => {
          if (response.status === 'SUCCESS') {
            /** https://${yourOktaDomain}/oauth2/default/v1/authorize
             * This is a starting point for browser-based OpenID Connect flows 
             * such as the implicit and authorization code flows. 
             * The goal of an authentication flow would be to set an Okta session cookie on the user's browser 
             * or retrieve an id_token or access_token.
             * This request authenticates the user and returns tokens along with an authorization grant 
             * to the client application as a part of the callback response.
             */
            // this.authClient.session.setCookieAndRedirect(transaction.sessionToken); // Sets a cookie on redirect
            return this.authClient.token.getWithoutPrompt({
              /** When you've obtained a sessionToken from the authorization flows, 
               * or a session already exists, 
               * you can obtain a token or tokens without prompting the user to log in.
               */
              clientId: this.oauthService.clientId,
              // Use an array if specifying multiple response types - in this case,
              // the response will contain both an ID Token and an Access Token.
              responseType: ['id_token', 'token'],
              scopes: ['openid', 'profile', 'email', 'groups'], // this.oauthService.scope,
              sessionToken: response.sessionToken,
              nonce: nonce,
              redirectUri: window.location.origin
            }) // Once you have retrieved an id_token and access_token.
              .then((tokens) => {
                const idToken = tokens[0].idToken;
                const accessToken = tokens[1].accessToken;

                // parses and stores the idToken and accessToken so they can be retrieved using OAuthService.getIdToken() and OAuthService.getAccessToken()
                const keyValuePair = `#id_token=${encodeURIComponent(idToken)}&access_token=${encodeURIComponent(accessToken)}`;

                /** https://${yourOktaDomain}m/oauth2/default/v1/token
                * Checks whether there are tokens in the hash fragment as a result of the implicit flow. 
                * These tokens are parsed, validated and used to sign the user in to the current client.
                */
                return this.oauthService.tryLogin({ // LoginOptions
                  customHashFragment: keyValuePair,
                  disableOAuth2StateCheck: true
                });
              });
          } else {
            return Promise.reject('We cannot handle the ' + response.status + ' status');
          }
        });
      });
    });
  }

  logOut(): void {
    console.log("Succesfully logged out");
    this.oauthService.logOut();

    this.router.navigate(['/auth/login'] /*, navigationExtras */);
  }

  checkLogin(url: string): boolean {

    if (this.oauthService.hasValidIdToken()) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.redirectUrl = url;
    /*
    // Get idToken and accessToken
    let idToken = this.oauthService.getIdToken();
    let accessToken = this.oauthService.getAccessToken();
 
    // Set our navigation extras object
    // that contains our global query params and fragment
    let navigationExtras: NavigationExtras = {
        queryParams: { 'id_token': idToken, 'access_token': accessToken },
        fragment: 'anchor'
    };
    */
    // Navigate to the login page with extras
    this.router.navigate(['/auth/login'] /*, navigationExtras */);

    return false;
  }

  isAuthenticated() {
    return observableOf(this.oauthService.hasValidIdToken());
  }

  public get givenName() {
    const claims = this.oauthService.getIdentityClaims();
    // console.log(claims);
    if (!claims)
      return null;
    return claims['name'];
  }

  public get eMail() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims)
      return null;
    return claims['email'];
  }


  public get groups() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims)
      return null;
    return claims['groups'];
  }


  public getAccessToken() {
    return this.oauthService.getAccessToken();
  }

}
