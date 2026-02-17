

import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core";
import { Observable, from, of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { MemoryCacheService } from "./services/memory-cache.service";




export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

export class CustomTranslateLoader implements TranslateLoader {

  private baseUrl = "https://shimmering-froyo-ffe775.netlify.app";

  constructor(
    private http: HttpClient,
    private cache: MemoryCacheService<TranslationTree>
  ) {}

  getTranslation(lang: string): Observable<TranslationTree> {
    const key = `translations_${lang}`;

    const cached = this.cache.get(key);
    if (cached) {
      return of(cached); 
    }

    return this.http
      .get<TranslationTree>(`${this.baseUrl}/${lang}.json`)
      .pipe(
        tap(translations => this.cache.set(key, translations)) // ✅ ok
      );
  }
}
