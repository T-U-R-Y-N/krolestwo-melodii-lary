# Raport testów · Królestwo Melodii Lary v0.9.0

Data: 13 listopada 2026, Europe/Warsaw. Dokładne identyfikatory publikacji i sumy plików są w RELEASE.json paczki przekazania. Nie modyfikowano repozytoriów SRC, JSM ani innych projektów.

## Testy automatyczne — PASS 42/42

20 prób kodu aplikacji, 8 symulacji service workera, 14 prób modułu filmów i integralności danych. Źródła oraz pełne wyniki JSON są w paczce. Dwie próby plików filmowych wymagają opcjonalnych części; przy uruchomieniu samej paczki bez filmów są pomijane.

| Obszar | Wynik i dowód |
|---|---|
| Katalog | 15 lekcji, pięć poziomów, sześć kolęd, cztery polskie pieśni; 25 unikalnych ID |
| Zachowanie istniejących treści | 22 niezmieniane utwory identyczne z wejściowym v0.8.5 |
| Trzy korekty | Wojtuś, Jagódki i Bella ciao: wysokości, czasy, pauzy, tempo i forma porównane z transkrypcją PDF; sumy taktów zgodne z metrum |
| Pełne odtwarzanie | Zegar przechodzi wszystkie zdarzenia trzech poprawionych utworów i 472 dźwięki Białych róż |
| Białe róże | Osiem stron tekstu, osiem przebiegów melodii, 48 części i 512 zdarzeń |
| Nawigacja | Ekran wejścia ma jeden przycisk; powrót z garderoby zachowuje piosenkę; kolaż pomijany w stosie powrotu |
| Mikrofon | 25 syntetycznych wysokości, cisza, odmowa pozwolenia, start i zatrzymanie ścieżek po wyjściu |
| Dane | Stary klucz, aliasy i eksport v1; wszystkie pola przeniesione między dwiema niezależnymi instancjami; błędny JSON nie niszczy stanu |
| PWA | Preferowany fullscreen, zapas standalone, pionowy start kolażu, względne ID/scope/start, istniejące ikony |
| SW | 14 zasobów, offline, zapas dla URL z parametrem, brak ingerencji w inne projekty i duże filmy |
| Oryginalne filmy | Rozmiary i SHA-256 wszystkich ośmiu części oraz połączonych plików zgodne z oryginałami Drive |
| Zapis filmów | Uszkodzone dane, anulowanie i błąd pamięci nie tworzą fałszywego statusu gotowości ani nie zastępują dobrej kopii |
| Alternatywna pamięć | Sprawdzono awarię dużych rekordów, przejście do oddzielnego Cache Storage, odtworzenie bajtów, wykrycie brakujących części i usuwanie |
| Orientacja | Logika wybiera portrait dla 720×1280 i landscape dla 1280×720; test z podstawionym API nie jest próbą rzeczywistego obrotu telefonu |
| Tryb online | Te same sprawdzone bajty odtwarzane bez zapisu i bez deklarowania gotowości offline |

## Próby w rzeczywistym Chrome

- Otworzono kolaż i przejście sercem do menu, nową sekcję Występy Lusi oraz odtwarzacze.
- Sprawdzono ramkę 832×384 i 384×832 CSS px. To symulacja rozmiaru, nie fizyczny Android.
- Pierwszy film zapisano w pamięci urządzenia testowego; natywny odtwarzacz odczytał 21,108267 s i 720×1280 bez błędu.
- Drugi film odtworzono w jakości oryginału w trybie online; odtwarzacz odczytał 207,963789 s, 480×854, readyState 4, postęp czasu i brak błędu dekodowania.
- Przetestowano obsługę odmowy zapisu: duży film nie został błędnie oznaczony jako gotowy offline, mniejszy pozostał dostępny.

## Ograniczenie próby dużego filmu offline

W zarządzanej przeglądarce testowej wystąpił QuotaExceededError po zapisaniu około 59 MB danych i próbie kolejnej części, mimo że API estimate zgłaszało znacznie większą kwotę. Sprawdzono mniejsze transakcje, zapis danych w częściach i osobny magazyn Cache Storage. Ta przeglądarka nadal odmówiła zapisania całego drugiego filmu. Nie potwierdzono przyczyny rozbieżności limitów na poziomie środowiska.

Kod obsługuje pełny zapis i jego błędy, a testy kontrolowane przechodzą, ale **nie deklarujemy zweryfikowanego działania obu pełnych filmów offline w rzeczywistym Chrome**. Pierwszy film można było zapisać, drugi obejrzano online. Na docelowym telefonie potrzebna jest próba obu pobrań, statusu Gotowy offline oraz ponownego odtworzenia w trybie samolotowym. Same pliki zajmują 124,2 MB, do pracy potrzebny jest zapas wolnego miejsca.

## Czego nie potwierdzono

Instalacji z ikoną i braku paska na fizycznym Androidzie; automatycznego obrotu kolażu/filmów na tym urządzeniu; mikrofonu z prawdziwym Yamaha PSR-74; niezależnej poprawności muzycznej całych 25 opracowań. Kontrola API, manifestu i źródłowych nut nie zastępuje tych prób. Pełny ekran może wymagać zaufanego dotknięcia i może być ograniczony przez przeglądarkę lub osadzenie w ramce.

Znane rozbieżności metryczne pozostałych pieśni zachowano w audit-patriotic-meter.json. Własny śpiewnik rodzica ma pierwszeństwo przed nowym tekstem domyślnym.

## Dodatkowe potwierdzenie po wyłączeniu serwera

Wyłączono lokalny serwer przez sites-preview stop i niezależnym żądaniem potwierdzono Connection refused. Następnie przeładowano stronę w Chrome: powrócił kolaż, zadziałało wejście i nawigacja do filmów. Pierwszy film odczytano ponownie z pamięci; odtwarzacz dotarł do końca 21,108267 s, readyState 4, 720×1280, bez błędu. To potwierdza offline podstawowej aplikacji i pierwszego filmu w środowisku testowym.

Diagnostyka interfejsu zgłosiła poprawny HTTPS/lokalny bezpieczny kontekst, oba rozmiary ikon, manifest, aktywny SW i pliki offline. Pełny ekran wywołany w ramce testowej nie został potwierdzony; orientację sprzętową pozostawiono do odbioru Androida.

## Publikacja

Kod aplikacji: commit 9fcb3070c5d651a201779a5cc815b91748e297b9. GitHub Pages zakończył wdrożenie powodzeniem: https://github.com/T-U-R-Y-N/krolestwo-melodii-lary/actions/runs/43379847562 . Adres aplikacji pozostaje https://t-u-r-y-n.github.io/krolestwo-melodii-lary/ . Wynik kontroli publicznych plików i dokładne sumy są w tests/results-production.json paczki.

Doprecyzowanie pełnego ekranu startu: manifest preferuje display_override fullscreen, z zapasem standalone; diagnostyka rozpoznaje oba tryby. Faktyczny wybór trybu przez Chrome na Androidzie wymaga odbioru urządzenia.
