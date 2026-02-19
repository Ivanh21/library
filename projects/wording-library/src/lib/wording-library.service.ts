import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WORDING_LIBRARY_CONFIG, WordingLibraryConfig } from './wording-library.config';
import { lastValueFrom } from 'rxjs';
import { WordingCacheService } from './wording-cache.service';

@Injectable({
  providedIn: 'root'
})
export class WordingLibraryService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private memoryCache: WordingCacheService<string>,
    @Inject(WORDING_LIBRARY_CONFIG) private config: WordingLibraryConfig
  ) {}

    async initVersionCheck(): Promise<boolean> {
      
        try {
          const serverVersions = await lastValueFrom(
            this.http.get<Record<string, string>>(`${this.config.baseUrl}/${this.config.fileConfigVersion}.json`)
          );
      
          let hasNewVersion = false;
      
          //const currentLang = this.translate.currentLang || this.translate.defaultLang;
      
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

          const defaultLang = this.translate.getDefaultLang() || 'fr';

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
