# NDH Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.0.

## Running locally
1. Install [Node.js](https://nodejs.org) (tested on Node.js 18+)
2. Clone the repository
    ```sh
    git clone https://github.com/HL7-FAST/ndh-management-ui/
    ```
3. Install node-modules:
    ```sh
    npm ci
    ```
4. Run the application
    ```sh
    npm start
    ```
5. The application is now running on http://localhost:4200


## Running in Docker

1. Install [Docker](https://docs.docker.com/get-docker/)
2. Clone the repository
    ```sh
    git clone https://github.com/HL7-FAST/ndh-management-ui/
    ```
3. Use Docker Compose or build and run the Docker image

### Using Docker Compose

1. Build and run:
    ```sh
    docker compose up
    ```
    or detached:
    ```sh
    docker compose up -d
    ```

### Building and running Docker image

1. Build the ndh-management-ui image:
    ```sh
    docker build -t ndh-management-ui .
    ```
2. Run ndh-management-ui in Docker:
    ```sh
    docker run -p 80:80 ndh-management-ui
    ``` 
    or detached: 
    ```sh
    docker run -dp 80:80 ndh-management-ui
    ``` 
3. The application is now running on http://localhost


## Auth Code Flow Config
You will need to configure your identity provider or remove the security from the project

```
import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: '',

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '/',

  loginUrl: window.location.origin + '/',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: '',

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  // dummyClientSecret: 'secret',
  dummyClientSecret: '',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope: 'openid profile email',

  showDebugInformation: true,
};
```

To disable security you can remove this section from `app.module.ts`

```
OAuthModule.forRoot({
    resourceServer: {
        allowedUrls: [`${environment.baseApiUrl}`],
        sendAccessToken: true
    }
})
```

You will probably also want to remove the `AuthBypassInterceptor` from `interceptor.barrel.ts`. This interceptor is related to the `auth-bypass` component which allows requests to ignore the sceurity settings of the National Directory FHIR server. If you are using this against your own fhir server that does not have security enabled this will be uncessary and can be removed as well. The component can be found in the `app.module` imports as well as `app.component`.

```
<span class="toolbar-divider">
    <app-auth-bypass></app-auth-bypass>
</span>
```


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Questions and Contributions
Questions about the project can be asked in the [US National Directory stream on the FHIR Zulip Chat](https://chat.fhir.org/#narrow/stream/283066-united-states.2Fnational-directory).

This project welcomes Pull Requests. Any issues identified with the RI should be submitted via the [GitHub issue tracker](https://github.com/HL7-FAST/ndh-management-ui/issues).

As of October 1, 2022, The Lantana Consulting Group is responsible for the management and maintenance of this Reference Implementation.
In addition to posting on FHIR Zulip Chat channel mentioned above you can contact [Corey Spears](mailto:corey.spears@lantanagroup.com) for questions or requests.
