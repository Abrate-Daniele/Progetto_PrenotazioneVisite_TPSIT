/* =====================================================
   INSERIMENTO DATI DI PROVA
   ===================================================== */

/* -------------------------
   REPARTI
   ------------------------- */

INSERT INTO REPARTI (nomeRep, nMaxVisiteG) VALUES
('Cardiologia', 20),
('Ortopedia', 15),
('Dermatologia', 25),
('Oculistica', 18);


/* -------------------------
   DOTTORI
   ------------------------- */

INSERT INTO DOTTORI (nome, cognome, dataN, indirizzo, mail, password, idRep, costo) VALUES
('Mario', 'Rossi', '1975-04-12', 'Via Roma 12', 'm.rossi@ospedale.it', 'pass123', 1, 120.00),
('Luca', 'Bianchi', '1980-09-22', 'Via Torino 8', 'l.bianchi@ospedale.it', 'pass123', 2, 100.00),
('Giulia', 'Verdi', '1985-02-15', 'Via Milano 30', 'g.verdi@ospedale.it', 'pass123', 3, 90.00),
('Paolo', 'Neri', '1978-11-03', 'Via Firenze 5', 'p.neri@ospedale.it', 'pass123', 4, 110.00),
('Luigi', 'Giallo', '1975-12-03', 'Via Roma 34', 'l.giallo@ospedale.it', 'pass123', 1, 80.00);


/* -------------------------
   UTENTI
   ------------------------- */

INSERT INTO USER (nome, cognome, dataN, indirizzo, mail, password) VALUES
('Andrea', 'Ferrari', '1995-03-10', 'Via Cavour 15', 'andrea.ferrari@email.it', 'pass123'),
('Sara', 'Gallo', '1998-07-25', 'Via Garibaldi 21', 'sara.gallo@email.it', 'pass123'),
('Marco', 'Conti', '1992-01-18', 'Via Dante 9', 'marco.conti@email.it', 'pass123');


/* -------------------------
   ADMIN
   ------------------------- */

INSERT INTO ADMIN (utente, mail, password) VALUES
('admin', 'admin@ospedale.it', 'admin123');


/* -------------------------
   VISITE
   ------------------------- */

INSERT INTO VISITE (data, ora, idUser, idMedico, idRep, pagata, stato, note) VALUES
('2026-03-10', 1, 1, 1, 1, TRUE, 'C', ' '),
('2026-03-10', 2, 2, 1, 1, FALSE, 'C', ' '),
('2026-03-11', 1, 3, 2, 2, TRUE, 'C', ' '),
('2026-03-12', 3, 1, 3, 3, FALSE, 'C', ' '),
('2026-03-12', 4, 2, 4, 4, TRUE, 'C', ' ');
