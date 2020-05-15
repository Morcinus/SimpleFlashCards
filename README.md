# SimpleFlashCards

Simple Flashcards je webová aplikace určená k jednoduchému učení pojmů (např. slovíček cizího jazyka).

## Základní funkce

Jednotlivé pojmy jsou v aplikaci zobrazovány jako kartičky, které mají z jedné strany otázku a z druhé strany odpověď. Pojmy do aplikace zadávají sami uživatelé, díky čemuž má každý možnost vytvářet vlastní balíčky těchto karet.

Balíčky pak uživatelé mohou sdílet, upravovat, "připínat" (čímž si uloží odkazy na balíčky ostatních) nebo je třídit do kolekcí.

## Učení

Učení probíhá tak, že si uživatel zobrazuje jednotlivé karty balíčku, které mají z jedné strany napsanou otázku a z druhé strany odpověď. Po otočení dané kartičky uživatel určí, zda-li odpověděl na otázku správně a jestli pro něj byla otázka lehká, středně těžká nebo těžká. Aplikace na základě těchto odpovědí zaznamenává pokrok uživatele a podle toho mu pak vybírá kartičky k učení.

## Módy učení

U každého balíčku nebo kolekce jsou tři možnosti, jak se uživatel může pojmy učit.

### Učení se nových pojmů

V tomto módu aplikace pro uživatele vybere kartičky, které uživatel ještě neviděl. Díky tomu se může učit novou látku.

### Opakování starých pojmů

V tomto módu aplikace pro uživatele vybere nejvhodnější kartičky k zopakování na základě toho, jak je uživatel umí. Přednostně vybírá kartičky, se kterýma má uživatel problém nebo které ještě dobře neumí.

### Učení se a opakování

Tento mód je kombinací předchozích dvou. Aplikace vybere kartičky k opakování, ale zároveň i kartičky nové. Díky tomu se uživatel může učit a opakovat si pojmy zároveň.

## Kolekce

Podstatnou funkcí této aplikace je možnost seskupování balíčků do tzv. kolekcí. U každé kolekce jsou pak stejné módy učení jako u balíčků. Zde ovšem aplikace vybírá kartičky ze všech balíčků dané kolekce. Díky tomu mohou uživatelé přehledně organizovat balíčky a taky se je systematicky učit.

U kolekce, stejně jako u balíčku, může uživatel nastavit, zda bude veřejná či soukromá. Na základě toho k ní pak budou nebo nebudou moci přistupovat ostatní uživatelé.

## Projekt

Projekt je rozdělen do dvou částí:

- [firebase-functions](https://github.com/Morcinus/SimpleFlashCards/tree/master/firebase-functions) - API, které bylo vytvořeno pro komunikaci mezi Cloud Firestore databází a klientem.
- [simpleflashcards-client](https://github.com/Morcinus/SimpleFlashCards/tree/master/simpleflashcards-client) - Samotná Simple Flashcards webová aplikace.

## Aplikace byla sestavena pomocí

- [Cloud Firestore](https://cloud.google.com/firestore) - NoSQL databáze, ve které jsou uložena všechna data aplikace.
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions) - Služba, ve které jsou uložené funkce, které manipulují s daty v Cloud Firestore databázi.
- [Firebase Storage](https://firebase.google.com/docs/storage) - Místo, na které se ukládají všechny obrázky, které uživatelé nahrají do aplikace.
- [Firebase Authentication](https://firebase.google.com/docs/auth) - Služba, která spravuje uživatelské účty této aplikace.
- [Firebase Hosting](https://firebase.google.com/docs/hosting) - Hosting, na kterém běží tato aplikace.

## Autor a licence

© Jan Jeníček, [Apache 2.0 Licence](LICENSE)

## Odkazy

- [Simple Flashcards](https://simpleflashcards-4aea0.firebaseapp.com)
- [Stránka o aplikaci](https://morcinus.github.io/SimpleFlashCards/)
- [Uživatelská doukumentace](https://morcinus.github.io/simpleflashcards-user-docs/)
- [Vývojářská dokumentace pro front-end (simpleflashcards-client)](https://morcinus.github.io/simpleflashcards-client-docs/)
- [Vývojářská dokumentace pro back-end (firebase-functions)](https://morcinus.github.io/simpleflashcards-fb-functions-docs/)
- [PDF vývojářské dokumentace](https://morcinus.github.io/SimpleFlashCards/docs/dev_docs_simpleflashcards.pdf)
- [PDF uživatelské dokumentace](https://morcinus.github.io/SimpleFlashCards/docs/user_docs_simpleflashcards.pdf)
