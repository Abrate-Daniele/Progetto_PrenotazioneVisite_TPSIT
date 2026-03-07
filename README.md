## Progetto Prenotazione Visite

Applicazione per la gestione di visite mediche con tre ruoli principali:
- **paziente**: prenota visite, visualizza calendario e paga le visite in evidenza
- **medico**: visualizza il proprio calendario di visite
- **admin**: visualizza il calendario per reparto

### Tecnologie utilizzate

- **Frontend**: Angular 20, Bootstrap 5
- **Backend**: Node.js con Express
- **Database**: MySQL

### Requisiti

- Node.js installato
- MySQL con un database chiamato `Progetto_TPSIT`

### Setup database

1. Importare in MySQL lo schema in `server/model/creaDb.sql`
2. Importare i dati di esempio in `server/model/inserimentoDB.sql`
3. Verificare le credenziali in `server/model/controller.js` (host, utente, password)

### Avvio del backend

```bash
cd server
node server.js
```

Il server partirà su `http://localhost:8081`.

### Avvio del frontend

```bash
npm install
npm start
```

L'app Angular sarà disponibile su `http://localhost:4200`.

### Flusso principale

- Registrazione paziente dalla pagina di login
- Login scegliendo il ruolo corretto
- Accesso alla homepage con:
  - se paziente: profilo, calendario, prenotazione visite, visite in evidenza da pagare
  - se medico: profilo e calendario delle visite
  - se admin: profilo e calendario filtrato per reparto

### Note

- Le chiamate al backend usano la stessa porta e il CORS è configurato per `http://localhost:4200`
- Le sessioni utente sono gestite tramite `express-session`

# Progetto

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
