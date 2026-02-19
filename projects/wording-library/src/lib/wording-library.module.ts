import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { WordingLibraryComponent } from './wording-library.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { WORDING_LIBRARY_CONFIG, WordingLibraryConfig } from './wording-library.config';
import { WordingLibraryService } from './wording-library.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslationTree, WordingCustomLoader } from './wording-custom-loader';
import { WordingCacheService } from './wording-cache.service';

export function initWording(service: WordingLibraryService) {
  return () => service.initVersionCheck();
}

export function createTranslateLoader(http: HttpClient, config: WordingLibraryConfig, cache: WordingCacheService<TranslationTree | string>) {
  console.log('createTranslateLoader called');
  return new WordingCustomLoader(http, config, cache);
}

@NgModule({
  declarations: [
    
  ],
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, WORDING_LIBRARY_CONFIG, WordingCacheService]
      }
    })
  ],
  exports: [
    
  ]
})
export class WordingLibraryModule {

  static forRoot(config: WordingLibraryConfig): ModuleWithProviders<WordingLibraryModule> {
    return {
      ngModule: WordingLibraryModule,
      providers: [
        { provide: WORDING_LIBRARY_CONFIG, useValue: config },
        WordingLibraryService,
        WordingCacheService,
        {
          provide: APP_INITIALIZER,
          useFactory: (service: WordingLibraryService) => () => service.initVersionCheck(),
          deps: [WordingLibraryService],
          multi: true
        }
      ]
    };
  }

 }
