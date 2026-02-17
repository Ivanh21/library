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

  // async initVersionCheck(): Promise<boolean> {
  //     const baseUrl = this.config.baseUrl;
  //     try {
    
  //       const serverVersions = await lastValueFrom(
  //         this.http.get<Record<string, string>>(`${baseUrl}/${this.config.fileConfigVersion}.json`)
  //       );
    
  //       let hasNewVersion = false;
    
  //       for (const lang of Object.keys(serverVersions)) {
    
  //         const localV = localStorage.getItem(`translations_version_${lang}`);
  //         const serverV = serverVersions[lang];
    
  //         console.log(`Lang=${lang} | local=${localV} | server=${serverV}`);
    
  //         if (localV !== serverV) {
    
  //           hasNewVersion = true;
  
  //           localStorage.removeItem(`translations_${lang}`);
  //           localStorage.setItem(`translations_version_${lang}`, serverV);
    
  //           await lastValueFrom(this.translate.reloadLang(lang));
    
  //           const current = this.translate.currentLang || this.translate.defaultLang;
    
  //           if (current === lang) {
  //             await lastValueFrom(this.translate.use(lang));
  //           }
  //         }
  //       }
    
  //       return hasNewVersion;
    
  //     } catch (error) {
  //       console.error('Impossible de vérifier les versions', error);
  //       return false;
  //     }
  //   }

    async initVersionCheck(): Promise<boolean> {
      
        try {
          const serverVersions = await lastValueFrom(
            this.http.get<Record<string, string>>(`${this.config.baseUrl}/${this.config.fileConfigVersion}.json`)
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
