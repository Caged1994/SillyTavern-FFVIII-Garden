# FFVIII • Garden — 0.1.0

Estensione UI per SillyTavern: menu blu con bordi argentati, protagonista letto dalla Persona attiva, GF, magie, Junction, inventario e registro degli eventi. La chat centrale è la chat originale di SillyTavern.

## Installazione da GitHub

1. Apri **Estensioni → Install Extension** in SillyTavern.
2. Incolla `https://github.com/Caged1994/SillyTavern-FFVIII-Garden`.
3. Conferma e ricarica la pagina.
4. Apri una chat e scegli la Persona, poi premi **Carica kit di prova** per verificare i menu.

Per aggiornare il codice usa il comando di aggiornamento in **Gestisci estensioni**.

## Installazione del pacchetto ZIP su Windows

1. Chiudi SillyTavern.
2. Estrai lo ZIP. Troverai la cartella `ff8-garden`.
3. Apri la cartella in cui è installato SillyTavern (quella che contiene `Start.bat` e `public`).
4. Copia `ff8-garden` dentro `public\scripts\extensions\third-party`. Crea `third-party` se non esiste.
5. Controlla che il percorso finale sia `SillyTavern\public\scripts\extensions\third-party\ff8-garden\manifest.json`. Evita una doppia cartella `ff8-garden\ff8-garden`.
6. Avvia SillyTavern e ricarica la pagina con **Ctrl+F5**.
7. In **Estensioni**, apri **FFVIII • Garden** e verifica che **Attiva layout Garden** sia selezionato. Se non compare, controlla in Gestisci estensioni che non sia disabilitata.
8. Apri una chat e scegli una Persona.

È una normale estensione frontend, senza plugin server, Extras, nuove API key o installazione di pacchetti. La copia manuale la rende disponibile a tutti gli utenti di questa installazione. I file dell’estensione si trovano nella radice del repository, come richiesto dall’installazione tramite URL.

## Prima prova — circa due minuti

1. Apri una chat di prova e seleziona la Persona che vuoi usare come protagonista.
2. Premi **Carica kit di prova**: vengono aggiunti Shiva, Quezacotl, 80 unità di Fire/Blizzard/Thunder/Cura e almeno 5 Pozioni. Il kit è una funzione di prova esplicita, non una ricompensa narrativa.
3. Vai in **Junction**, seleziona **Forza**, scegli **Fire** e premi **Applica Junction**. La statistica passa da 10 a 18.
4. Associa **Cura** agli **HP**: il massimo passa da 500 a 980. Gli HP attuali non vengono curati automaticamente.
5. Vai in **Guardian Force**, seleziona **Resistenza-J** come apprendimento di Shiva. Assegna 100 AP: ora la Junction a Resistenza è disponibile.
6. Cambia Persona: il nome e il ritratto cambiano e le risorse dell'altra Persona restano separate. Tornando alla prima ritrovi i suoi dati.
7. Ricarica la pagina: le modifiche vengono conservate nei metadati della chat.

## Narrazione e nuovi GF

Se **Condividi stato e protocollo con l’IA** è attivo, l’estensione aggiunge alle normali richieste uno stato aggiornato e le istruzioni per gli eventi. Continua a usare il tuo modello e collegamento attuali. Non viene fatta una seconda chiamata API.

L’IA descrive gli eventi e può emettere blocchi `garden-event`. L’estensione valida numeri, risorse e abilità. Un nuovo GF può avere nome, descrizione ed elemento originali, ma tutte le abilità provengono dal catalogo fisso. L’incontro non equivale all’acquisizione; anche dopo l’acquisizione, equipaggiamento e Junction spettano all’utente.

Esempio di risposta compatibile:

````text
Dal soffitto della biblioteca scende Vesper, un GF simile a una falena argentata. Per ora si limita a osservarti.

```garden-event
{"id":"vesper-incontro-001","type":"gf_discover","gf":"vesper","name":"Vesper","description":"Una falena argentata che custodisce i sogni.","element":"Non elementale","abilities":["j_hp","j_mag","j_spr","mag20","magic","draw","item","summon"]}
```
````

Per acquisirlo successivamente:

````text
```garden-event
{"id":"vesper-patto-002","type":"gf_acquire","gf":"vesper"}
```
````

Sono supportati anche eventi `magic`, `item`, `gil`, `hp`, `ap`. Gli ID unici impediscono di riapplicare lo stesso evento. Un blocco non valido non viene applicato e viene segnalato; un gruppo di eventi viene applicato solo se tutti sono validi.

**Applica eventi IA a fine risposta** è attivo inizialmente. Disattivalo nelle impostazioni se preferisci leggere la risposta e premere **Leggi eventi dell’ultima risposta**. I blocchi rimangono visibili nella chat in questa versione. Il modello potrebbe non rispettare il protocollo: resta possibile modificare risorse e aggiungere GF tramite i menu.

## Regole implementate

- Scorte di magie 0–100; una magia può essere associata a una sola statistica.
- Junction consentite solo per abilità apprese di GF acquisiti ed equipaggiati.
- Apprendimento di un’abilità per GF; gli AP si applicano a tutti i GF equipaggiati che hanno un apprendimento selezionato. Gli AP in eccesso non passano a un'altra abilità.
- Fino a 3 comandi oltre ad Attacco e 2 passive; bonus HP/Forza/Magia/Resistenza +20%.
- Pozioni, Granpozioni e Code di fenice con consumo e recupero deterministici.
- Export/import JSON per la Persona nella chat corrente; annullamento delle ultime 12 operazioni, incluso un gruppo di eventi IA.
- Risorse vuote iniziali; statistiche base configurabili, livello 1–100.

Le formule della v0.1 sono **ispirate a FFVIII, semplificate**, non una replica esatta del gioco. La formula è `base + floor(bonus della magia a 100 unità × scorta / 100)`, poi bonus passivi; tetto 9999 HP e 255 per le altre statistiche. Le quantità consumate riducono i bonus; quando una scorta arriva a zero la Junction viene rimossa. Cambiare GF può eliminare Junction non più consentite. Il livello è modificabile e non cambia automaticamente le statistiche.

## Limiti della prima versione

Non include ancora un motore di combattimento, ATB, nemici, danni calcolati, Limit Break, animazioni, squadra NPC, Junction elementali/status, Triple Triad, raffinazione o l'intero catalogo del gioco. Gli eventi HP emessi dall’IA sono conseguenze narrative, non risultati di un combattimento simulato. Non usare ancora questa versione come motore di battaglia.

Il layout è pensato per PC da 1366 px in su. Sotto 1050 px il pannello sinistro viene nascosto; il supporto telefono completo non fa parte di questa versione. Il mockup iniziale era una proposta artistica: qui trovi pannelli reali nello stesso linguaggio visivo, il ritratto della tua Persona e lo sfondo già scelto in SillyTavern, senza ritratti FFVIII o sfondi artistici incorporati.

Se rigeneri, modifichi o cancelli una risposta dopo che i suoi eventi sono stati applicati, i dati già salvati **non vengono riavvolti automaticamente**. Usa **Annulla** prima di scegliere una nuova versione, oppure correggi le risorse. Le modifiche fuori da Garden non aggiornano automaticamente il suo stato. I salvataggi appartengono alla chat, quindi eliminando la chat elimini anche quei dati; esporta prima se vuoi conservarli.

## Disattivazione e rimozione

**Chiudi** nella barra in alto ripristina il layout originale. Per riaprire Garden, attivalo nelle impostazioni delle Estensioni. Puoi spegnere il collegamento narrativo indipendentemente dal layout. Per rimuovere la copia manuale: chiudi SillyTavern, rimuovi solo `public\scripts\extensions\third-party\ff8-garden` e riavvia. I metadati nelle chat vengono conservati.

## Verifica e riferimenti

Implementazione verificata contro il codice pubblico del commit `06bde939f` indicato nello screenshot (SillyTavern 1.19.0). API: `SillyTavern.getContext()`, `chatMetadata`, `saveMetadata()`, `extensionSettings`, `setExtensionPrompt()` e gli eventi di chat/Persona/generazione. Solo l'identità e l'avatar della Persona sono letti dal modulo `scripts/personas.js`; se quel modulo non fosse disponibile si usa il nome come identificatore di ripiego (due Persone omonime non sarebbero distinguibili).

- Documentazione ufficiale: https://docs.sillytavern.app/for-contributors/writing-extensions/
- Codice della versione: https://github.com/SillyTavern/SillyTavern/tree/06bde939f

Test del motore: `npm test` (solo Node, senza dipendenze), 8 test superati. Interazioni dei menu verificate anche tramite DOM con API SillyTavern simulate: Junction, AP, cambio Persona, salvataggi, eventi, duplicati, annullamento e disattivazione. Non è stato possibile eseguire la verifica grafica in un browser in questo ambiente. Rimane da confermare il layout e il funzionamento sulla tua installazione reale, comprese le altre estensioni e il tuo modello online.

Progetto fan non ufficiale. Codice originale sotto licenza MIT; Final Fantasy e i relativi nomi appartengono ai rispettivi titolari.
