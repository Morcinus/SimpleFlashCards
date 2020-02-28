# SimpleFlashCards

Simple Flashcards je webová aplikace určená k jednoduchému učení pojmů (např. slovíček cizího jazyka), která je zaměřena především na jednoduchost učení.

## Základní funkce

Jednotlivé pojmy jsou v aplikaci zobrazovány jako kartičky, které mají z jedné strany otázku a z druhé odpověď. Jednotlivé pojmy do aplikace zadávají uživatelé, díky čemuž má každý možnost vytvářet vlastní balíčky těchto karet.

Jednotlivé balíčky pak uživatelé mohou sdílet, upravovat, "připínat" (čímž si uloží odkazy na balíčky ostatních) nebo je třídit do kolekcí.

## Učení

Učení probíhá tak, že si uživatel zobrazuje jednotlivé kartičky, které mají z jedné strany napsanou otázku a z druhé strany odpověď. Po zobrazení dané kartičky uživatel určí, zda-li odpověděl na otázku správně a jestli pro něj byla otázka lehká, středně těžká nebo těžká. Aplikace pak na základě těchto odpovědí zaznamenává pokrok uživatele a podle toho mu ukazuje další kartičky.

## Módy učení

U každého balíčku/kolekce jsou tři možnosti, jak se uživatel může učit jednotlivé kartičky.

### Učení se nových pojmů

V tomto módu aplikace pro uživatele vybere kartičky, které uživatel ještě neviděl. Díky tomu se může učit novou látku.

### Opakování starých pojmů

V tomto módu aplikace pro uživatele vybere nejvhodnější kartičky k zopakování na základě toho, jak je uživatel umí. Přednostně vybírá kartičky, se kterýma má uživatel problém nebo které ještě neumí.

### Učení se a opakování

Tento mód je kombinací předchozích dvou. Aplikace vybere kartičky k opakování, ale zároveň i kartičky nové. Díky tomu se uživatel může učit a opakovat si pojmy zároveň.

## Kolekce

Podstatnou funkcí této aplikace je možnost seskupování balíčků do tzv. kolekcí. U každé kolekce jsou pak stejné módy učení jako u balíčků. Zde ovšem aplikace vybírá kartičky ze všech balíčků dané kolekce. Díky tomu mohou uživatelé přehledně organizovat balíčky a taky se je systematicky učit.

U kolekce, stejně jako u balíčku, může uživatel nastavit, zda bude veřejná či soukromá. Na základě toho k ní pak budou nebo nebudou moci přistupovat ostatní uživatelé

---

## Projekt

Projekt je rozdělen do dvou částí:

- [firebase-functions](https://github.com/Morcinus/SimpleFlashCards/tree/master/firebase-functions) - Funkce, které komunikují s klientem a databází.
- [simpleflashcards-client](https://github.com/Morcinus/SimpleFlashCards/tree/master/simpleflashcards-client) - Samotná webová aplikace.

---

## Autor

- **Jan Jeníček**

## Nejdůležitější použité knihovny

Front-end:

- [Material UI](https://material-ui.com/)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [axios](https://www.npmjs.com/package/axios)
- [material-table](https://github.com/mbrn/material-table)

Back-end:

- [express](https://expressjs.com/)
- [firebase](https://www.npmjs.com/package/firebase)
- [firebase-admin](https://www.npmjs.com/package/firebase-admin)
- [firebase-functions](https://www.npmjs.com/package/firebase-functions)
- [busboy](https://www.npmjs.com/package/busboy)

## Aplikace byla sestavena pomocí

- [Cloud Firestore](https://cloud.google.com/firestore) - NoSQL databáze, ve které jsou uložena všechna data aplikace.
- [Firebase Cloud Funcitons](https://firebase.google.com/docs/functions) - Služba, ve které jsou uložené funkce, které manipulují s daty v Cloud Firestore databázi.
- [Firebase Storage](https://firebase.google.com/docs/storage) - Místo, kam se ukládají všechny obrázky, které uživatelé nahrají do aplikace.
- [Firebase Authentication](https://firebase.google.com/docs/auth) - Služba, která spravuje uživatelské účty této aplikace.
- [Firebase Hosting](https://firebase.google.com/docs/hosting) - Hosting na kterém běží tato aplikace.

---

## Odkazy

- [Simple Flashcards](https://simpleflashcards-4aea0.firebaseapp.com)
- [Stránka o aplikaci](https://morcinus.github.io/SimpleFlashCards/)
- [Uživatelská doukumentace](https://morcinus.github.io/simpleflashcards-user-docs/)
- [Programátorská dokumentace pro simpleflashcards-client](https://morcinus.github.io/simpleflashcards-client-docs/)
- [Programátorská dokumentace pro firebase-functions](https://morcinus.github.io/simpleflashcards-fb-functions-docs/)
