/* =====================================================
   DATABASE: GESTIONE VISITE MEDICHE
   ===================================================== */

/* =====================================================
   TABELLA USER
   ===================================================== */

CREATE TABLE USER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cognome VARCHAR(50) NOT NULL,
    dataN DATE NOT NULL,
    indirizzo VARCHAR(150),
    mail VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);


/* =====================================================
   TABELLA REPARTI
   ===================================================== */

CREATE TABLE REPARTI (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomeRep VARCHAR(100) NOT NULL,
    nMaxVisiteG INT NOT NULL
);


/* =====================================================
   TABELLA ADMIN
   ===================================================== */

CREATE TABLE ADMIN (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utente VARCHAR(50) NOT NULL,
    mail VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);


/* =====================================================
   TABELLA DOTTORI
   ===================================================== */

CREATE TABLE DOTTORI (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cognome VARCHAR(50) NOT NULL,
    dataN DATE NOT NULL,
    indirizzo VARCHAR(150),
    mail VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    idRep INT NOT NULL,
    costo DECIMAL(8,2) NOT NULL,

    CONSTRAINT fk_dottori_reparti
        FOREIGN KEY (idRep)
        REFERENCES REPARTI(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


/* =====================================================
   TABELLA VISITE
   ===================================================== */

CREATE TABLE VISITE (
    idVis INT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    ora INT NOT NULL,
    idUser INT NOT NULL,
    idMedico INT NOT NULL,
    idRep INT NOT NULL,
    pagata BOOLEAN DEFAULT FALSE,
    stato CHAR NOT NULL,
    note VARCHAR(200) NOT NULL,

    CONSTRAINT fk_visite_user
        FOREIGN KEY (idUser)
        REFERENCES USER(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_visite_medico
        FOREIGN KEY (idMedico)
        REFERENCES DOTTORI(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_visite_reparto
        FOREIGN KEY (idRep)
        REFERENCES REPARTI(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
