

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { MemoryCacheService } from './memory-cache.service';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private baseUrl = 'https://shimmering-froyo-ffe775.netlify.app';
  //private baseUrl = "./translations";
  
  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private memoryCache: MemoryCacheService<string>
  ) {}

  async initVersionCheck(): Promise<boolean> {
    try {
      const serverVersions = await lastValueFrom(
        this.http.get<Record<string, string>>(`${this.baseUrl}/versions.json`)
      );
  
      let hasNewVersion = false;
  
      const currentLang = this.translate.currentLang || this.translate.defaultLang;
  
      for (const lang of Object.keys(serverVersions)) {
  
        const localV = this.memoryCache.get(`translations_version_${lang}`);
        const serverV = serverVersions[lang]; 
  
        if (localV !== serverV) {
  
          hasNewVersion = true;
  
          // Invalidation cache mémoire
          this.memoryCache.clear(`translations_${lang}`);
  
          // Mise à jour version en mémoire
          this.memoryCache.set(`translations_version_${lang}`, serverV);
  
          // Reload seulement si la langue active a changé
          if (currentLang === lang) {
            await lastValueFrom(this.translate.reloadLang(lang));
            //await lastValueFrom(this.translate.use(lang));
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