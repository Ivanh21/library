import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { CustomTranslateLoader, TranslationTree } from './translate-custom-loader';
import { TranslationService } from './services/translation.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MemoryCacheService } from './services/memory-cache.service';

export function createTranslateLoader(http: HttpClient, cache: MemoryCacheService<TranslationTree | string>) {
  return new CustomTranslateLoader(http, cache);
}

export function initializeApp(versionService: TranslationService) {
  return () => versionService.initVersionCheck();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, MemoryCacheService]
      }
    })
  ],
  providers: [
    TranslationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [TranslationService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
