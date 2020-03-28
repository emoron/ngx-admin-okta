/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

export const authConfig: AuthConfig = {
        
        // Url of the Identity Provider
        issuer: `${environment.auth.url}/oauth2/${environment.auth.issuer}`,
       
        // URL of the SPA to redirect the user to after login
        redirectUri: window.location.origin,
       
        // The SPA's id. The SPA is registerd with this id at the auth-server
        clientId: `${environment.clientId}`,
       
        // set the scope for the permissions the client should request
        // The first three are defined by OIDC. The 4th is a usecase-specific one
        scope: 'openid profile email groups',
        
}