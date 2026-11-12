# Raport testów — Królestwo Melodii Lary v0.8.5

Data: 13 listopada 2026, Europe/Warsaw.

Stan publikacji: **WDROŻONO I SPRAWDZONO PUBLICZNIE**.

| Element | Potwierdzony stan |
|---|---|
| Aplikacja | https://t-u-r-y-n.github.io/krolestwo-melodii-lary/ |
| Repozytorium | https://github.com/T-U-R-Y-N/krolestwo-melodii-lary — publiczne |
| GitHub Pages | Deploy from a branch, `main`, `/ (root)` |
| HTTPS | Wymuszone w ustawieniach Pages; publiczna strona i diagnostyka działają po HTTPS |
| Commit aplikacji | `7659559f6216510f19e0a36ef60e01c84095f419` |
| Pierwsze wdrożenie | GitHub Actions `43329665144`: completed / success |
| Kompletność | Wszystkie 18 plików w repozytorium odpowiadają bajtowo sprawdzonym plikom lokalnym (porównano identyfikatory Git blob) |

Na publicznym adresie diagnostyka zwróciła HTTP 200 dla manifestu, ikon i `sw.js`; service worker ma stan `activated`, a sześć podstawowych plików znajduje się w pamięci offline. Manifest jest serwowany jako `application/manifest+json`, skrypt jako `application/javascript`. Zweryfikowano też otwarcie aplikacji i działanie podstawowej nawigacji po publikacji.

## Wprowadzone poprawki

- Naprawiono import własnych tekstów śpiewnika. Poprzedni kod eksportował `songbooks`, ale pomijał je przy odczycie JSON.
- Zachowano klucz lokalnego zapisu i wersję formatu eksportu oraz zgodność ze starszymi plikami.
- Diagnostyka sprawdza aktywnego service workera i obecność podstawowych plików w pamięci offline; samo pobranie `sw.js` nie jest już uznawane za dowód działania offline.
- Instrukcja instalacji wskazuje docelowy GitHub Pages. Usunięto nieaktualne odwołanie do hostingu Netlify.
- Doprecyzowano komunikaty braku/zajętości mikrofonu i błędów rejestracji offline.
- Odświeżono wersję pamięci service workera oraz opis śpiewnika z czterema pieśniami.

## Wyniki

| Obszar | Wynik | Sposób sprawdzenia |
|---|---|---|
| Nawigacja i pięć poziomów | PASS | Rzeczywiste kliknięcia w Chrome; 15 lekcji w pięciu poziomach |
| Kolędy | PASS | Otwarcie i rozpoczęcie pełnego odtwarzania każdej z sześciu kolęd; pauza i powrót |
| Polskie pieśni | PASS | Cztery ekrany odtwarzacza, wybór całości i otwarcie każdego śpiewnika |
| Białe róże — tekst | PASS | Osiem zwrotek w danych i w wyświetlonym śpiewniku, także po zapisie przez edytor |
| Białe róże — cała melodia | PASS | Osiem identycznych przebiegów; 512 zdarzeń. Symulacja zegara odtwarzacza dociera do końca 422 uderzeń i planuje wszystkie 472 dźwięki |
| Zachowanie oryginalnych melodii | PASS | Porównanie całego katalogu nut, rytmów, temp, oktaw i aranżacji z załączonym HTML v0.8.5 — identyczne |
| Śpiewnik i własne teksty | PASS | Edycja/zapis w interfejsie, import własnego tekstu i sprawdzenie jego obecności w wyeksportowanym pliku |
| Garderoba | PASS | Zmiana fryzury i koloru sukienki, zachowanie po ponownym otwarciu strony |
| Ulubione, kompozytor | PASS | Nawigacja po ulubionych, utworzenie i zapis melodii C–E–G |
| Układ 832 × 384 | PASS w przeglądarce | Dokument aplikacji w ramce o dokładnym rozmiarze 832 × 384 CSS px, test orientacji poziomej. Klawiatura i przyciski mieszczą się wewnątrz ekranu |
| Manifest i ścieżki | PASS lokalnie i publicznie | `id`, `start_url`, `scope` = `./`; `display: standalone`, `orientation: landscape`; obie wersje manifestu identyczne; pliki istnieją |
| Ikony | PASS | PNG 192 × 192, 512 × 512, maskable 512 × 512 oraz favicon 48 × 48. Ikona maskable ma nieprzezroczyste tło |
| Rzeczywisty service worker | PASS lokalnie i publicznie | Chrome: stan `activated`, diagnostyka potwierdza obecność sześciu podstawowych zasobów w Cache Storage |
| Uruchomienie przy niedostępnym serwerze | PASS w Chrome | Zatrzymano serwer podglądu, połączenie HTTP zwracało `Connection refused`. Odświeżenie aplikacji uruchomiło ją z pamięci, pozwoliło otworzyć Białe róże i rozpocząć odtwarzanie |
| Obsługa offline na ścieżce projektu | PASS w symulacji | Zdarzenia service workera pod adresem `/krolestwo-melodii-lary/`: dziewięć zasobów, manifest JSON, start z parametrem, odświeżanie online, pomijanie żądań POST i innych domen |
| Eksport JSON | PASS w Chrome | Pobrano rzeczywisty plik; zweryfikowano format, wersję, kryształki, dwie własne melodie i tekst śpiewnika |
| Import JSON | PASS w Chrome | Zaimportowano plik testowy, przywrócono 23 kryształki, oznaczenia H, wyłączenie solfeżu, melodię oraz własny tekst |
| Zgodność danych między urządzeniami | PASS w teście logiki | Dwie niezależne instancje aplikacji: pełny eksport/import zachowuje wszystkie pola; stare identyfikatory migrują; starsze pliki bez `songbooks` są obsługiwane |
| Odporność importu | PASS | Nieprawidłowy JSON nie zmienia istniejącego stanu |
| Detektor dźwięku | PASS w teście syntetycznym | Sygnał sinusoidalny dla wszystkich 25 wspieranych wysokości G3–G5 i test ciszy; identyfikacja nut zgodna |
| Uruchomienie/zatrzymanie nasłuchu | PASS w teście logiki | Symulacja lokalnego strumienia, odmowy zgody i zatrzymywania ścieżek po nawigacji |
| Nagrania i postępy poza urządzeniem | PASS w przeglądzie kodu | Brak MediaRecorder, analityki, WebSocket, sendBeacon i zewnętrznych skryptów; fetch pobiera tylko pliki aplikacji. Wyjście do zewnętrznego śpiewnika następuje wyłącznie przez świadome kliknięcie linku |
| Publiczny GitHub Pages i jego HTTPS | PASS | Publiczne repozytorium i aplikacja, udane wdrożenie GitHub Actions, `main` / root, wymuszone HTTPS i diagnostyka instalacji na publicznym adresie |
| Instalacja i ikona na rzeczywistym Androidzie | NIE SPRAWDZONO | Brak dostępu do fizycznego urządzenia Android. Parametry manifestu są poprawne; nie są dowodem zakończonej instalacji |
| Nasłuch rzeczywistego keyboardu przez telefon | NIE SPRAWDZONO | Środowisko testowe nie zapewnia mikrofonu telefonu i instrumentu. Sam wybór trybu oraz obsługę błędów sprawdzono, a detektor testowano syntetycznie |

Testy automatyczne logiki: **16/16**. Testy zdarzeń service workera: **7/7**. Dodatkowo wykonano testy interfejsu w Chrome 156 na Linux. Ekran w ramce weryfikuje rozmiar i orientację CSS, nie jest emulatorem systemu Android. Rzeczywisty eksport/import sprawdzono w profilu testowym; test dwóch instancji jest testem programowym, a nie testem dwóch fizycznych telefonów.

## Ograniczenie dotyczące muzyki

Paczka źródłowa zgłasza niespójności sum wartości rytmicznych z metrum niektórych taktów pieśni patriotycznych. Zachowano oryginalne nuty i dołączony audyt. Ten raport potwierdza funkcjonowanie techniczne odtwarzacza, nie poprawność transkrypcji muzycznej ani zgodność hymnu z wykonaniem urzędowym.

## Odbiór na Androidzie po publikacji

1. Otworzyć publiczną stronę w Chrome, sprawdzić „Kącik rodzica → Sprawdź instalację”.
2. Zainstalować przez Chrome i uruchomić z ikony; sprawdzić brak paska adresu, ikonę i poziomy układ.
3. Po pierwszym uruchomieniu online zamknąć aplikację, wyłączyć połączenie i otworzyć ją z ikony ponownie; wybrać i odtworzyć piosenkę.
4. Włączyć „Graj ze mną → Słucham, co grasz!”, udzielić zgody na mikrofon, sprawdzić poprawną i błędną nutę na keyboardzie oraz powtórzoną nutę po puszczeniu klawisza.
5. Wyeksportować dane, przenieść plik i zaimportować na drugim telefonie. Nie usuwać wcześniejszej kopii przed potwierdzeniem przeniesienia.

## Dokumentacja techniczna

- https://web.dev/articles/install-criteria
- https://developer.chrome.com/blog/update-install-criteria
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
