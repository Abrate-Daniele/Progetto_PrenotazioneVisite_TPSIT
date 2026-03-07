## Progetto Prenotazione Visite

Applicazione per la gestione di visite mediche con tre ruoli principali:
- **paziente**: prenota visite, visualizza calendario e paga le visite in evidenza
- **medico**: visualizza il proprio calendario di visite
- **admin**: visualizza il calendario per reparto

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