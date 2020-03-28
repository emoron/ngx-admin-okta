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
import { CanActivate, CanActivateChild, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad  {

  constructor(private authService: AuthService, private router: Router) { }

  // CanActivate. Interface that a class can implement to be a guard deciding if a route can be activated.
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.authService.checkLogin(url);
  }

  // CanAtivateChild. Interface that a class can implement to be a guard deciding if a child route can be activated.
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  // CanLoad. Interface that a class can implement to be a guard deciding if a children can be loaded.
  canLoad(route: Route): boolean {
    let url = `/${route.path}`;

    return this.authService.checkLogin(url);
  }
}
