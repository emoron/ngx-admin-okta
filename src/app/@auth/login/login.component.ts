/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { NbLoginComponent, NbAuthService, NB_AUTH_OPTIONS, getDeepFromObject } from '@nebular/auth';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends NbLoginComponent {

  constructor(private authService: AuthService,
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private route: ActivatedRoute) {

    super(service, options, cd, router);

    this.route.queryParams.subscribe(params => {
      if (params['status'])
        switch (params['status']) {
          case '201': {
            const email = params['email'];
            const msj = `Un correo de activación de cuenta ha sido enviado a su dirección ${email}.`;
            this.messages.push(msj);
            break;
          } default: {
            break;
          }
        }

    });

    this.authService.configureWithNewConfigApi();

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    // this.strategy = this.getConfigValue('forms.login.strategy');
  }

  login(): void {
    // console.log(this.options);
    this.submitted = false;

    // A Promise object is expected.
    this.authService.login(this.user.email, this.user.password)
      .then(_ => {
        // console.debug('logged in');

        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/pages';

        // Set our navigation extras object
        // that passes on our global query params and fragment
        let navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };

        // Redirect the user
        console.debug(redirect);
        this.router.navigate([redirect], navigationExtras);
      }).catch(
        err => {
          console.log('error logging in', err);
          this.errors.push(`ERROR DE AUTENTICACIÓN. ${err.toString()}`);
          //this.messages
        }
      );
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

}
