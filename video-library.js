/* Original video bytes are optional. Progress JSON and media storage are separate. */
(() => {
  'use strict';
  const CATALOG = [{"id": "lusi-1", "title": "Występ Lusi 1", "fileName": "VID-20261004-WA0012_1.mp4", "mimeType": "video/mp4", "bytes": 25722528, "duration": 21.108267, "width": 720, "height": 1280, "sha256": "0f6be510f3e4e8cf355a2e6f1b1745a6459b3415214868f6fdca983692d5210e", "poster": "./assets/lusi-1.jpg", "parts": [{"src": "./media/video-parts/lusi-1.part01.bin", "bytes": 16777216, "sha256": "6761cd85db0565de2edbdd1282863a81d8541d3de236036fb55c7695e1bb2a80"}, {"src": "./media/video-parts/lusi-1.part02.bin", "bytes": 8945312, "sha256": "c3f0e12bf140179c492bcffac1bb894f1e49081867d3e8780e2061949e4403a0"}]}, {"id": "lusi-2", "title": "Występ Lusi 2", "fileName": "VID-20261030-WA0028.mp4", "mimeType": "video/mp4", "bytes": 98472404, "duration": 207.963789, "width": 480, "height": 854, "sha256": "9e5ed2d938805777537d4aa372ad57c83f55f9882b1f42edf760443508fcfb2c", "poster": "./assets/lusi-2.jpg", "parts": [{"src": "./media/video-parts/lusi-2.part01.bin", "bytes": 16777216, "sha256": "7edc3fd90a7f7f4386f9214b2ccbcc4be302c7797e95cad61f874a05b1ed7282"}, {"src": "./media/video-parts/lusi-2.part02.bin", "bytes": 16777216, "sha256": "96f1d86786b84cb14c598eb03567c8da2a490cef6a543caa2a9d4bb780283103"}, {"src": "./media/video-parts/lusi-2.part03.bin", "bytes": 16777216, "sha256": "abbea021c6292fc93d26c30d346d0084224d13cc75ad927cb9740567c1486ceb"}, {"src": "./media/video-parts/lusi-2.part04.bin", "bytes": 16777216, "sha256": "b27406bf615bf5465cb074d2de435be035a152458a642e7f49d833d83e2c0798"}, {"src": "./media/video-parts/lusi-2.part05.bin", "bytes": 16777216, "sha256": "68e2022933d960344539059f07a6bab89d6578b71ed77a84cb6fb578e88fe960"}, {"src": "./media/video-parts/lusi-2.part06.bin", "bytes": 14586324, "sha256": "c74de7915db50f80201068661da06e970f35319c2795e3c377ae9a40a1773168"}]}];
  const DATABASE = 'krolestwo-lary-media-v1';
  const STORE = 'videos';
  const MEDIA_CACHE = 'krolestwo-lary-video-files-v1';
  let databasePromise;

  function video(id) {
    const item = CATALOG.find(v => v.id === id);
    if (!item) throw new Error('Nie znam tego filmu.');
    return item;
  }

  function openDatabase() {
    if (!('indexedDB' in window)) return Promise.reject(new Error('Ta przeglądarka nie udostępnia zapisu filmów. Otwórz aplikację w Chrome.'));
    if (!databasePromise) databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE, {keyPath: 'id'});
      request.onsuccess = () => {
        request.result.onversionchange = () => { request.result.close(); databasePromise = null; };
        resolve(request.result);
      };
      request.onerror = () => { databasePromise = null; reject(new Error('Nie udało się otworzyć pamięci filmów.')); };
      request.onblocked = () => { databasePromise = null; reject(new Error('Zamknij drugą kartę aplikacji i spróbuj ponownie.')); };
    });
    return databasePromise;
  }

  async function transaction(mode, operation) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const request = operation(tx.objectStore(STORE));
      let result;
      request.onsuccess = () => { result = request.result; };
      tx.oncomplete = () => resolve(result);
      tx.onerror = tx.onabort = () => reject(tx.error || request.error || new Error('Nie udało się zapisać filmu.'));
    });
  }

  function valid(saved, info) {
    return saved && saved.sha256 === info.sha256 && ((saved.blob instanceof Blob && saved.blob.size === info.bytes) || (saved.partCount === info.parts.length && saved.bytes === info.bytes));
  }

  async function get(id) {
    const info = video(id);
    const saved = await transaction('readonly', store => store.get(id));
    if (!valid(saved, info)) return null;
    if (saved.blob instanceof Blob) return saved; // Existing complete files remain readable.
    const parts = [];
    for (let i = 0; i < info.parts.length; i++) {
      if (saved.backend === 'cache') {
        const response = await (await caches.open(MEDIA_CACHE)).match(saved.keys[i]);
        if (!response) return null;
        const blob = await response.blob();
        if (blob.size !== info.parts[i].bytes) return null;
        parts.push(blob);
        continue;
      }
      const part = await transaction('readonly', store => store.get(saved.keys?.[i] || id + '#' + i));
      const value = part?.data || part?.blob;
      if (!value || (value.byteLength ?? value.size) !== info.parts[i].bytes) return null;
      parts.push(value);
    }
    return {...saved, blob: new Blob(parts, {type: info.mimeType})};
  }

  async function readyIds() {
    const entries = await Promise.all(CATALOG.map(info => transaction('readonly', store => store.get(info.id))));
    const ready = [];
    for (const saved of entries) {
      if (!saved || !CATALOG.some(v => v.id === saved.id && valid(saved, v))) continue;
      if (saved.backend === 'cache') {
        const cache = await caches.open(MEDIA_CACHE);
        const found = await Promise.all(saved.keys.map(key => cache.match(key)));
        if (!found.every(Boolean)) continue;
      }
      ready.push(saved.id);
    }
    return ready;
  }

  async function digest(bytes) {
    if (!window.crypto?.subtle) throw new Error('Sprawdzanie filmu wymaga otwarcia aplikacji przez HTTPS.');
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async function checkPart(bytes, part) {
    if (bytes.byteLength !== part.bytes || await digest(bytes) !== part.sha256) throw new Error('Pobieranie filmu jest niekompletne. Spróbuj ponownie.');
  }

  async function save(id, blob) {
    const info = video(id);
    if (blob.size !== info.bytes) throw new Error('Film jest niekompletny.');
    const keys = [];
    const previous = await transaction('readonly', store => store.get(id));
    try {
      // Bound each transaction to one small Blob. Publish completion only after
      // every chunk commits; an existing complete copy remains readable meanwhile.
      const generation = crypto.randomUUID();
      let offset = 0;
      for (let i = 0; i < info.parts.length; i++) {
        const key = id + '#' + generation + '#' + i;
        keys.push(key);
        const end = offset + info.parts[i].bytes;
        const data = new Uint8Array(await blob.slice(offset, end).arrayBuffer());
        await transaction('readwrite', store => store.put({id: key, data}));
        offset = end;
      }
      await transaction('readwrite', store => store.put({id, sha256: info.sha256, name: info.fileName, bytes: info.bytes, partCount: info.parts.length, keys, savedAt: new Date().toISOString()}));
    } catch (error) {
      for (const key of keys) await transaction('readwrite', store => store.delete(key)).catch(() => {});
      if (error.name === 'QuotaExceededError' && 'caches' in window) {
        await saveToCache(info, blob, previous);
        return;
      }
      if (error.name === 'QuotaExceededError') throw new Error('Za mało miejsca na telefonie. Zwolnij pamięć i spróbuj ponownie.');
      throw error;
    }
    await cleanPrevious(previous, info);
  }

  async function cleanPrevious(previous, info) {
    if (!previous?.partCount) return;
    const oldKeys = previous.keys || info.parts.map((_, i) => info.id + '#' + i);
    if (previous.backend === 'cache') {
      const cache = await caches.open(MEDIA_CACHE);
      for (const key of oldKeys) await cache.delete(key).catch(() => {});
    } else {
      for (const key of oldKeys) await transaction('readwrite', store => store.delete(key)).catch(() => {});
    }
  }

  async function saveToCache(info, blob, previous) {
    const cache = await caches.open(MEDIA_CACHE), keys = [];
    const generation = crypto.randomUUID();
    let offset = 0;
    try {
      for (let i = 0; i < info.parts.length; i++) {
        const key = new URL('./.lara-media/' + info.id + '/' + generation + '/' + i, location.href).href;
        keys.push(key);
        const end = offset + info.parts[i].bytes;
        await cache.put(key, new Response(blob.slice(offset, end), {headers: {'Content-Type': info.mimeType, 'Content-Length': String(info.parts[i].bytes)}}));
        offset = end;
      }
      await transaction('readwrite', store => store.put({id: info.id, sha256: info.sha256, name: info.fileName, bytes: info.bytes, partCount: info.parts.length, keys, backend: 'cache', savedAt: new Date().toISOString()}));
    } catch (error) {
      for (const key of keys) await cache.delete(key).catch(() => {});
      if (error.name === 'QuotaExceededError') throw new Error('Za mało miejsca na telefonie. Zwolnij pamięć i spróbuj ponownie.');
      throw error;
    }
    await cleanPrevious(previous, info);
  }

  async function prepareStorage(bytes) {
    await openDatabase();
    if (navigator.storage?.estimate) {
      const {quota, usage = 0} = await navigator.storage.estimate();
      if (quota && quota - usage < bytes * 1.1) throw new Error('Za mało miejsca na telefonie na ten film.');
    }
    try { if (navigator.storage?.persist) await navigator.storage.persist(); } catch (_) {}
  }

  async function download(id, {onProgress = () => {}, signal, saveToDevice = true} = {}) {
    const info = video(id);
    if (saveToDevice) await prepareStorage(info.bytes);
    const buffers = [];
    let downloaded = 0;
    onProgress(0, info.bytes);
    for (const part of info.parts) {
      if (signal?.aborted) throw new DOMException('Anulowano', 'AbortError');
      const response = await fetch(new URL(part.src, location.href), {cache: 'no-store', signal});
      if (!response.ok) throw new Error('Nie udało się pobrać filmu. Sprawdź internet i spróbuj ponownie.');
      let bytes;
      if (response.body?.getReader) {
        const reader = response.body.getReader();
        const chunks = [];
        let size = 0;
        for (;;) {
          const {done, value} = await reader.read();
          if (done) break;
          chunks.push(value); size += value.byteLength;
          if (size > part.bytes) { await reader.cancel(); throw new Error('Nieprawidłowy plik filmu.'); }
          onProgress(downloaded + size, info.bytes);
        }
        bytes = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      } else {
        bytes = new Uint8Array(await response.arrayBuffer());
      }
      await checkPart(bytes, part);
      buffers.push(bytes);
      downloaded += bytes.byteLength;
      onProgress(downloaded, info.bytes);
    }
    if (signal?.aborted) throw new DOMException('Anulowano', 'AbortError');
    const blob = new Blob(buffers, {type: info.mimeType});
    if (!saveToDevice) return URL.createObjectURL(blob);
    await save(id, blob);
    onProgress(info.bytes, info.bytes);
    return info;
  }

  async function importFile(id, file, onProgress = () => {}) {
    const info = video(id);
    if (!file || file.size !== info.bytes) throw new Error('Wybierz oryginalny plik ' + info.fileName + '.');
    await prepareStorage(info.bytes);
    let offset = 0;
    for (const part of info.parts) {
      const bytes = new Uint8Array(await file.slice(offset, offset + part.bytes).arrayBuffer());
      await checkPart(bytes, part);
      offset += part.bytes; onProgress(offset, info.bytes);
    }
    await save(id, new Blob([file], {type: info.mimeType}));
    return info;
  }

  async function objectUrl(id) {
    const saved = await get(id);
    if (!saved) throw new Error('Najpierw zapisz ten film na telefonie.');
    return URL.createObjectURL(saved.blob);
  }

  async function remove(id) {
    const info = video(id);
    const saved = await transaction('readonly', store => store.get(id));
    if (saved?.backend === 'cache') {
      await cleanPrevious(saved, info);
      await transaction('readwrite', store => store.delete(id));
      return;
    }
    await transaction('readwrite', store => {
      const keys = saved?.keys || info.parts.map((_, i) => id + '#' + i);
      keys.forEach(key => store.delete(key));
      return store.delete(id);
    });
  }

  window.LaraVideos = Object.freeze({version: '0.9.0-media-12', catalog: CATALOG, database: DATABASE, mediaCache: MEDIA_CACHE, readyIds, download, onlineUrl: (id, options) => download(id, {...options, saveToDevice: false}), importFile, objectUrl, remove});
})();
