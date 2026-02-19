

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { MemoryCacheService } from './memory-cache.service';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private baseUrl = './assets/i18n';
  //private baseUrl = "https://shimmering-froyo-ffe775.netlify.app";

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private memoryCache: MemoryCacheService<string>
  ) { }

  async initVersionCheck(): Promise<boolean> {
    try {
      const serverVersions = await lastValueFrom(
        this.http.get<Record<string, string>>(`${this.baseUrl}/config.json`)
      );

      let hasNewVersion = false;

      // Iterate through all languages in the config
      for (const lang of Object.keys(serverVersions)) {

        const serverVersion = serverVersions[lang];
        const cacheKey = `version_${lang}`;
        const localVersion = this.memoryCache.get(cacheKey);

        // Always update the cache with the server version for this language
        this.memoryCache.set(cacheKey, serverVersion);

        if (localVersion !== serverVersion) {
          hasNewVersion = true;
          // Clear cached translations for this language
          this.memoryCache.clear(`translations_${lang}_v${localVersion}`);

          // If this is the current language, reload it
          if (this.translate.currentLang === lang) {
            await lastValueFrom(this.translate.reloadLang(lang));
          }
        }
      }

      return hasNewVersion;

    } catch (error) {
      console.error('Impossible de vérifier les versions', error);
      return false;
    }
  }




}