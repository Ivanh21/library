import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core"
import { map, Observable, of, tap } from "rxjs";
import { Inject } from "@angular/core";
import { WordingLibraryConfig } from "./wording-library.config";
import { WordingCacheService } from "./wording-cache.service";


export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

export class WordingCustomLoader implements TranslateLoader {

  constructor(
    private http: HttpClient,
    private config: WordingLibraryConfig,
    private cache: WordingCacheService<TranslationTree>
  ) {}

  getTranslation(lang: string): Observable<TranslationTree> {
    const key = `translations_${lang}`;

    const cached = this.cache.get(key);
    if (cached) {
      return of(cached);
    }

    return this.http
      .get<TranslationTree>(`${this.config.baseUrl}/${lang}.json`)
      .pipe(
        tap(translations => this.cache.set(key, translations))
      );
  }
}
