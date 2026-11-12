# Królestwo Melodii Lary

Instalowalna aplikacja muzyczna PWA, v0.8.5 z poprawkami wdrożeniowymi.

Docelowy adres: https://t-u-r-y-n.github.io/krolestwo-melodii-lary/

## Instalacja na Androidzie

1. Otwórz stronę w Chrome i dotknij dowolnego przycisku aplikacji.
2. Wybierz z menu Chrome opcję instalowania aplikacji lub użyj „Kącik rodzica → Na pulpit telefonu”. Nazwa opcji w menu zależy od wersji Chrome.
3. Uruchom aplikację z nowej ikony. Tryb `standalone` powinien otworzyć ją bez paska adresu, w poziomie.
4. Po pierwszym uruchomieniu online można korzystać z aplikacji offline. Gotowość pamięci offline sprawdzisz w „Kącik rodzica → Sprawdź instalację” lub na `install-check.html`.

Nie jest potrzebny plik APK ani instalacja z nieznanych źródeł. Działanie instalacji i mikrofonu na konkretnym telefonie trzeba sprawdzić na tym urządzeniu.

## Mikrofon i prywatność

„Graj ze mną → Słucham, co grasz!” wymaga zgody przeglądarki na mikrofon. Analiza pojedynczego dźwięku odbywa się w Web Audio na urządzeniu. Aplikacja nie zapisuje ani nie wysyła nagrań. Opuszczenie lekcji lub ukrycie aplikacji zatrzymuje nasłuch.

Postępy, wygląd księżniczki, własne melodie i teksty śpiewnika zapisują się w lokalnej pamięci przeglądarki. Nie ma zewnętrznej bazy danych, logowania, reklam ani analityki. Zwykłe pobranie plików z GitHub Pages korzysta z połączenia z hostingiem.

## Przenoszenie postępów

Na dotychczasowym urządzeniu wybierz „Kącik rodzica → Zapisz postępy (JSON)”. Przenieś plik na drugi telefon i wybierz „Wczytaj postępy”. Import zastępuje lokalny zapis; przed nim warto wyeksportować stan drugiego telefonu.

Zachowano klucz `krolestwo-lary-save-v1`, format `krolestwo-lary`, wersję eksportu `1` i migrację wcześniejszych identyfikatorów piosenek. Import obejmuje również własne teksty śpiewnika. Przejście ze starej domeny lub pliku HTML na nowy adres wymaga eksportu/importu.

## Publikacja

Pliki aplikacji znajdują się w katalogu głównym. GitHub Pages: „Deploy from a branch”, gałąź `main`, katalog `/ (root)`, HTTPS. Wszystkie ścieżki zasobów, startu i zakresu PWA są względne wobec katalogu aplikacji. `.nojekyll` wyłącza przetwarzanie Jekyll.

Plik `_headers` pochodzi z paczki źródłowej; GitHub Pages go nie interpretuje. Aplikacja nie polega na nim w celu instalacji ani korzystania z mikrofonu. Nie wymaga usług zewnętrznych poza hostingiem.

Przy kolejnych zmianach plików aplikacji należy zmienić `VERSION` w `sw.js`, aby odnowić zapis offline. Nie zmieniać klucza postępów bez migracji.

## Zawartość i weryfikacja muzyczna

15 lekcji w pięciu poziomach, sześć kolęd, cztery polskie pieśni, śpiewniki, garderoba, ogród i własne melodie. „Rozkwitały pąki białych róż” mają osiem zwrotek oraz osiem powtórzeń pełnej zapisanej melodii: 512 zdarzeń, w tym 472 dźwięki i 40 pauz.

Dane melodii i aranżacji zachowano identycznie z dostarczoną wersją v0.8.5. Źródłowe pliki `README.txt`, `CHANGELOG-v083.md` i `audit-patriotic-meter.json` wskazują istniejące niespójności niektórych taktów w transkrypcji pieśni patriotycznych. Testy wdrożeniowe nie stanowią audytu muzycznego ani potwierdzenia zgodności hymnu z wzorcem urzędowym.

Szczegóły testów i ograniczenia weryfikacji: `RAPORT_TESTOW.md`.
