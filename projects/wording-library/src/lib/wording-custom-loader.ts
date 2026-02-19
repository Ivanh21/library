import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core"
import { map, Observable, of, tap } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { WORDING_LIBRARY_CONFIG, WordingLibraryConfig } from "./wording-library.config";
import { WordingCacheService } from "./wording-cache.service";


export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

@Injectable({ providedIn: 'root' })
export class WordingCustomLoader implements TranslateLoader {

  constructor(
    private http: HttpClient,
    @Inject(WORDING_LIBRARY_CONFIG) private config: WordingLibraryConfig,
    private cache: WordingCacheService<TranslationTree | string>
  ) {}

  getTranslation(lang: string): Observable<TranslationTree> {
    const version = this.cache.get(`version_${lang}`) as string;
        const key = `translations_${lang}_v${version}`;
    
        const cached = this.cache.get(key) as TranslationTree;
        if (cached) {
          return of(cached);
        }
        console.log('CUSTOM LOADER CALLED', lang);
    
        return this.http
          .get<TranslationTree>(`${this.config.baseUrl}/${lang}.v${version}.json`)
          .pipe(
            tap(translations => this.cache.set(key, translations))
          );
  }
}


