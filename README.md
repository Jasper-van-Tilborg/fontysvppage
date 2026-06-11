# Fontys Virtual Production Minor - Website

Dit is de promo-website voor de Virtual Production minor van Fontys in Eindhoven. De site legt uit wat de minor inhoudt, wat je leert en hoe je je kan aanmelden.

## Wat zit erin?

De pagina bestaat uit een paar secties die je gewoon van boven naar beneden scrollt:

1. **Hero** – intro met logo en een korte animatie
2. **About** – wie zijn wij en wat doen we
3. **Why** – waarom je voor deze minor zou kiezen
4. **Programme** – het lesprogramma, in een horizontale tijdlijn
5. **Studio** – foto's van de studio
6. **Apply** – hoe je je aanmeldt en de deadlines

De site is beschikbaar in het **Nederlands** en **Engels** (rechtsboven kun je wisselen).

## Live

De website staat live op Vercel: [fontysvppage.vercel.app](https://fontysvppage.vercel.app)

## Hoe start je dit lokaal?

Zorg dat je Node.js geïnstalleerd hebt, installeer dan de packages en start de dev-server:

```bash
npm install
npm run dev
```

Ga daarna naar [http://localhost:3000](http://localhost:3000) in je browser.

## Gebouwd met

- **Next.js** – het framework
- **Tailwind CSS** – voor de styling
- **next-intl** – voor de NL/EN vertalingen

## Vertalingen aanpassen

Alle teksten staan in:

- `messages/nl.json` (Nederlands)
- `messages/en.json` (Engels)

Pas je hier een tekst aan, doe dat dan in beide bestanden zodat de vertaling klopt.