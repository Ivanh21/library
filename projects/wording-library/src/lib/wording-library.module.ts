import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { WordingLibraryComponent } from './wording-library.component';
import { HttpClientModule } from '@angular/common/http';
import { WORDING_LIBRARY_CONFIG, WordingLibraryConfig } from './wording-library.config';
import { WordingLibraryService } from './wording-library.service';

export function initWording(service: WordingLibraryService) {
  return () => service.initVersionCheck();
}

@NgModule({
  declarations: [
    
  ],
  imports: [
    HttpClientModule
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
        {
          provide: APP_INITIALIZER,
          useFactory: initWording,
          deps: [WordingLibraryService],
          multi: true
        }
      ]
    };
  }

 }
