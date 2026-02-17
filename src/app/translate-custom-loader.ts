

import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core";
import { Observable, from, of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { MemoryCacheService } from "./services/memory-cache.service";




export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

export class CustomTranslateLoader implements TranslateLoader {

  private baseUrl = "./assets/i18n";

  constructor(
    private http: HttpClient,
    private cache: MemoryCacheService<TranslationTree | string>
  ) { }

  getTranslation(lang: string): Observable<TranslationTree> {

    // Retrieve the version stored by TranslationService
    const version = this.cache.get('app_version') as string;
    const key = `translations_${lang}_v${version}`;

    const cached = this.cache.get(key) as TranslationTree;
    if (cached) {
      return of(cached);
    }

    const url = version
      ? `${this.baseUrl}/${lang}.v${version}.json`
      : `${this.baseUrl}/${lang}.json`; // Fallback if no version found

    return this.http
      .get<TranslationTree>(url)
      .pipe(
        tap(translations => this.cache.set(key, translations))
      );
  }
}
