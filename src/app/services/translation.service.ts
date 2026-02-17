

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
      const config = await lastValueFrom(
        this.http.get<{ version: string, active_languages: string[] }>(`${this.baseUrl}/config.json`)
      );

      const serverVersion = config.version;
      const currentLang = this.translate.currentLang || this.translate.defaultLang;

      // Store version in cache for the loader to use
      this.memoryCache.set('app_version', serverVersion);

      // Optional: Check if version changed for active language to trigger reload
      const localVersion = this.memoryCache.get(`translations_version_${currentLang}`);

      if (localVersion !== serverVersion) {
        this.memoryCache.clear(`translations_${currentLang}`);
        this.memoryCache.set(`translations_version_${currentLang}`, serverVersion);

        if (currentLang) {
          await lastValueFrom(this.translate.reloadLang(currentLang));
        }
        return true;
      }

      return false;

    } catch (error) {
      console.error('Impossible de vérifier les versions', error);
      return false;
    }
  }




}