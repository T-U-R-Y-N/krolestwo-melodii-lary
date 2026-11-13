# v0.9.1 — nuty całej melodii

Data: 2026-11-13.

- W odtwarzaczu, obok **📖 Tekst**, jest nowy przycisk **🎼 Nuty**.
- Pełna, przewijalna karta przedstawia cały zapis melodyczny utworu: nuty, pauzy, ich długości, sekcje i frazy.
- Widok odczytuje istniejące dane wszystkich 25 utworów i nie zależy od wybranego fragmentu 4/8/16/32 nut.
- Kolorowe oznaczenia wysokości i opcja polskiego H/B pozostają spójne z keyboardem aplikacji.
- Dotychczasowy śpiewnik, własne teksty rodzica, postępy, ID utworów, aliasy, zapis v1 i filmy nie są modyfikowane.
- Wersja aplikacji 0.9.1; pamięć PWA: `lara-melodies-v091-scorebook-14`.
- Dane katalogowe nie były ponownie poddawane zewnętrznej weryfikacji muzycznej.
- Widok nut to **litery i wartości rytmiczne**, nie klasyczna pięciolinia.

Kontrole przed wdrożeniem: 23 testy aplikacji, 8 SW, 12 modułu filmów — PASS (2 testy fizycznych bajtów wideo wymagają osobnych części). Podgląd interfejsu Chromium 832×384 oraz 384×832 — PASS w symulacji desktopowej, nie jest to odbiór fizycznego Androida.
