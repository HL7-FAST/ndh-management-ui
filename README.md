# NDH Management Client

This project is a web app client built on Angular 18 to manage resources for the [National Directory of Healthcare Providers & Services (NDH)](https://build.fhir.org/ig/HL7/fhir-us-ndh/).

This application is currently hosted in the HL7 Foundry at https://ndh-management-ui.fast.hl7.org/

The corresponding FHIR server reference implementation is hosted at https://national-directory.fast.hl7.org/fhir with its source code available at https://github.com/hl7-fast/national-directory/tree/hapi

## Foundry
A live demo is hosted by [HL7 FHIR Foundry](https://foundry.hl7.org/products/56f11074-355e-46d1-b160-8ae498cea4e5).

## Running locally
1. Install [Node.js](https://nodejs.org) 
   - Check [Angular Version Compability](https://angular.dev/reference/versions) for guidance, generally v18+
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
