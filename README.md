# Królestwo Melodii Lary · v0.9.0

Aplikacja PWA do nauki pierwszych melodii na keyboardzie Yamaha PSR-74.

Aplikacja: https://t-u-r-y-n.github.io/krolestwo-melodii-lary/
Repozytorium: https://github.com/T-U-R-Y-N/krolestwo-melodii-lary

## Zakres

Kolaż Lary z małym, mieniącym się sercem na wejściu; 15 lekcji w pięciu poziomach; sześć kolęd; cztery polskie pieśni; śpiewniki; garderoba, ogród, własne melodie i dwa Występy Lusi. Białe róże zachowują osiem zwrotek i osiem przebiegów melodii.

W v0.9.0 poprawiono nuty, oktawy, pauzy i tempo trzech utworów według PDF rodzica: Wojtuś (3/4, 96 BPM), Jagódki (2/4, 72 BPM), Bella ciao (2/4, 60 BPM). Bella ciao ma pełny tekst rodzica: sześć zwrotek i zakończenie. Pozostałe 22 utwory zachowują dane v0.8.5. Zgodność z dostarczonym PDF nie oznacza niezależnej recenzji muzycznej; starszy audyt pieśni pozostaje aktualny.

## Instalacja i orientacja

Otwórz adres HTTPS w Chrome, dotknij serca i wybierz instalowanie w menu Chrome lub kąciku rodzica. Uruchom z nowej ikony. Nie potrzeba APK ani instalacji z nieznanych źródeł.

Manifest preferuje pełny ekran PWA (fullscreen), z zapasem standalone, i uruchamia kolaż w pionie. Serce prosi o pełny ekran i poziom dla menu oraz keyboardu. Przycisk pełnego ekranu filmu prosi o orientację zgodną z jego wymiarami. Zachowane są proporcje i cały kadr. Automatyczny obrót zależy od urządzenia i przeglądarki. W zwykłej karcie schowanie interfejsu Chrome wymaga działania użytkownika.

Diagnostyka: [install-check.html](./install-check.html). Potwierdza pliki i zapis offline; instalację potwierdza dopiero rzeczywiste uruchomienie z ikony na telefonie. Próba fizycznego Androida i mikrofonu z PSR-74 wymaga osobnego odbioru.

## Filmy offline

W Występach Lusi naciśnij Zapisz film przy każdym nagraniu i zaczekaj na Gotowy offline. Same filmy zajmują łącznie około 124,2 MB. Pierwsze pobranie wymaga internetu oraz dodatkowego wolnego miejsca. Jakość odpowiada dokładnie plikom rodzica: 720 × 1280 i 480 × 854, bez transkodowania.

Moduł sprawdza rozmiary i SHA-256 części, zapisuje je w IndexedDB, a znacznik gotowości tworzy dopiero po ukończeniu. Duże części omijają SW, filmy nie są pobierane podczas instalacji. Pamięć filmów umożliwia wczytanie oryginalnego MP4 lub usunięcie lokalnej kopii. Filmy nie są częścią JSON postępu.

Katalog wideo zawiera ścieżki do media/video-parts/. Publiczne wdrożenie ma oryginalne części; paczka przekazania jest bez bajtów filmów i ma instrukcję odtworzenia.

## Zapis i prywatność

Klucz krolestwo-lary-save-v1, format krolestwo-lary, wersja eksportu 1 pozostają zgodne. Eksport/import przenosi postępy, kryształki, garderobę, preferencje, własne melodie i teksty śpiewników. Import zastępuje stan urządzenia docelowego. Wcześniej zmieniony prywatny śpiewnik ma pierwszeństwo przed nowym tekstem domyślnym.

Mikrofon analizuje pojedynczą nutę lokalnie przez Web Audio. Bez nagrywania, wysyłania audio, analityki i zewnętrznej bazy postępów. Zdjęcie i filmy na publicznym Pages są publicznymi plikami. Nie publikować eksportów postępów dziecka w repozytorium.

## Utrzymanie

GitHub Pages: main, / (root), HTTPS. Publikować zawartość app/ paczki z zachowaniem struktury. Ścieżki względne, .nojekyll wyłącza Jekyll. _headers jest pozostałością starszej paczki i nie jest interpretowany przez Pages.

Przy zmianach odświeżać wersję SW, a przy zmianie modułu również jego wersję w adresie HTML i precache. Nie zmieniać ID utworów ani formatu danych bez migracji. Nie modyfikować SRC, JSM i innych repozytoriów.

Wyniki i ograniczenia: [RAPORT_TESTOW.md](./RAPORT_TESTOW.md).
