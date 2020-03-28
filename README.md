# ngx-admin-okta
Please note, that ngx-admin is just a frontend application. Backend integration can be done relatively simple, but you should be aware that all the data is mocked using JavaScript objects. If you want the data to be dynamic, you should consider developing a backend integration by your own. The Nebular team doesn't consider providing generic integration layer as a part of this project because every backend API has a different structure in terms of data format and URLs.

## Create an OpenID Connect App in Okta
To integrate Okta for user authentication, you’ll first need to register and create an OIDC application.

Login to your [Okta](https://developer.okta.com/) account, or [**create one**](https://developer.okta.com/signup/) if you don’t have one. Navigate to Applications and click on the Add Application button. Select SPA and click Next. On the next page, specify http://localhost:4200 as a Base URI, Login redirect URI, and Logout redirect URI. Click Done and look for your application **Clien ID** under **settings**.

Modify `src/environments/environment.ts` (for production environment: `src/environments/environment.prod.ts`) to configure your app to use your Okta application’s settings.

```ts
export const environment = {
  production: false,

  auth: { url: 'https://${yourOktaDomain}', issuer: 'default' },
  clientId: '${clientId}',

};
```
* **Okta domain** - Find it on the Developer Console dashboard in the upper-right corner as the Org URL.

In your application code, a config object is built in `src/app/@auth/oauth2.config.ts` file. This is used to initialize the Okta services with the values specified in environment files above.

```ts
import { environment } from '../../environments/environment';

export const authConfig: AuthConfig = {
        
        issuer: `${environment.auth.url}/oauth2/${environment.auth.issuer}`,
       
        redirectUri: window.location.origin,
       
        clientId: `${environment.clientId}`,
       
        // set the scope for the permissions the client should request
        scope: 'openid profile email groups',
        
}
```
* **Note**: `openid`, `profile`, and `email` are reserved scopes in OpenID Connect that allow you to get access to user's data. You can read more about scopes [here](https://developer.okta.com/docs/reference/api/oidc/#scopes).

* On the other hand, `groups` scope is a usecase-specific one. [Here's](https://developer.okta.com/docs/guides/customize-tokens-returned-from-okta/add-groups-claim-org-as/) how you can add a groups claim for your `default` Authorization Server.

## Install tools
To install ngx-admin on your machine you need to have the following tools installed:

* **Git** - https://git-scm.com
* **Node.js** - https://nodejs.org. Please note the version should be >=8
* **Npm** - Node.js package manager, comes with Node.js. Please make sure npm version is >=5
* You might also need some specific native packages depending on your operating system like build-essential on Ubuntu

**Warning!**
Please note that **it is not possible** to build ngx-admin **without these tools** and it will not be possible because of the way how Angular is built.

## Download the code
When you completed tools setup, you need to download the code of ngx-admin application. The easiest way to do that is to clone GitHub repository:
```sh
$ git clone https://github.com/dgsergio84/ngx-admin-okta.git
````
After clone is completed, you need to install npm modules:
```sh
$ cd ngx-admin-okta && npm i
````
**Warning!**
Please make sure that installation process successfully completed without errors.


## Run local copy
To run a local copy in development mode, execute:
```sh
$ npm start
```
Go to http://0.0.0.0:4200 or http://localhost:4200 in your browser.

# ngx-admin [<img src="https://i.imgur.com/oMcxwZ0.png" alt="Eva Design System" height="20px" />](https://hubs.ly/H0n4ZDy0) [![Build Status](https://travis-ci.org/akveo/ngx-admin.svg?branch=master)](https://travis-ci.org/akveo/ngx-admin) [![Dependency Status](https://david-dm.org/akveo/ngx-admin/status.svg)](https://david-dm.org/akveo/ng2-admin)

[Who uses ngx-admin?](https://github.com/akveo/ngx-admin/issues/1645)| [Documentation](https://hubs.ly/H0n4Sfq0) | [Installation Guidelines](https://hubs.ly/H0n4Svc0)

# Admin template based on Angular 8+ and <a href="https://github.com/akveo/nebular">Nebular</a>
<a target="_blank" href="https://hubs.ly/H0n4Sw20"><img src="https://i.imgur.com/mFdqvgG.png"/></a>


### With 4 stunning visual themes



#### Default
<a target="_blank" href="https://hubs.ly/H0n4Tgv0"><img src="https://i.imgur.com/Kn3xDKQ.png"/></a>

#### Dark
<a target="_blank" href="https://hubs.ly/H0n4Th20"><img src="https://i.imgur.com/FAn5iXY.png"/></a>

#### Cosmic
<a target="_blank" href="https://hubs.ly/H0n4Tj80"><img src="https://i.imgur.com/iJu2YDF.png"/></a>

#### Corporate
<a target="_blank" href="https://hubs.ly/H0n4TDQ0"><img src="https://i.imgur.com/GpUt6NW.png"/></a>

### What's included:

- Angular 8+ & Typescript
- Bootstrap 4+ & SCSS
- Responsive layout
- RTL support
- High resolution
- Flexibly configurable themes with **hot-reload** (3 themes included)
- Authentication module with multiple providers
- 40+ Angular Components
- 60+ Usage Examples

### Demo

<a target="_blank" href="https://hubs.ly/H0n4Tk70">Live Demo</a>

## Documentation
This template is using [Nebular](https://github.com/akveo/nebular) modules set, [here you can find documentation and other useful articles](https://hubs.ly/H0n4ZPt0).

### Empty starter kit
Don't need all the pages and modules and just looking for an empty starter kit for your next project? Check out our [starter-kit branch](https://github.com/akveo/ngx-admin/tree/starter-kit).

## BrowserStack
This project runs its tests on multiple desktop and mobile browsers using [BrowserStack](http://www.browserstack.com).

<img src="https://cloud.githubusercontent.com/assets/131406/22254249/534d889e-e254-11e6-8427-a759fb23b7bd.png" height="40" />

## More from Akveo

- [Eva Icons](https://github.com/akveo/eva-icons) - 480+ beautiful Open Source icons
- [Nebular](https://github.com/akveo/nebular) - Angular Components, Auth and Security

### How can I support developers?
- Star our GitHub repo :star:
- Create pull requests, submit bugs, suggest new features or documentation updates :wrench:
- Follow us on [Twitter](https://twitter.com/akveo_inc) :feet:
- Like our page on [Facebook](https://www.facebook.com/akveo/) :thumbsup:

### Looking for engineering services? 
Visit [our homepage](https://hubs.ly/H0n4YJt0) or simply leave us a message to [contact@akveo.com](mailto:contact@akveo.com). We will be happy to work with you!

### From Developers
Made with :heart: by [Akveo team](https://hubs.ly/H0n4YwQ0). Follow us on [Twitter](https://twitter.com/akveo_inc) to get the latest news first!
We're always happy to receive your feedback!
