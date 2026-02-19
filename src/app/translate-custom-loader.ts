

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
  //private baseUrl = "https://shimmering-froyo-ffe775.netlify.app";

  constructor(
    private http: HttpClient,
    private cache: MemoryCacheService<TranslationTree | string>
  ) { }

  getTranslation(lang: string): Observable<TranslationTree> {

    // Retrieve the version for the specific language
    const version = this.cache.get(`version_${lang}`) as string;
    const key = `translations_${lang}_v${version}`;
    //console.log(`Loading translations for ${lang} with version ${key}`);

    const cached = this.cache.get(key) as TranslationTree;
    if (cached) {
      return of(cached);
    }

    const url = version
      ? `${this.baseUrl}/${lang}.v${version}.json`
      : `${this.baseUrl}/${lang}.json`;

    return this.http
      .get<TranslationTree>(url)
      .pipe(
        tap(translations => this.cache.set(key, translations))
      );
  }
}
