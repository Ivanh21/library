import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from './services/translation.service';
import { MemoryCacheService } from './services/memory-cache.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  lastLang: string = "";
  intervalId: any;
  updateAvailable = false;
  newVersion = '';
  dynamicName = "John Doe"

  constructor(private translate: TranslateService, private translationService: TranslationService) {
  }
  ngOnInit(): void {
    const savedLang = sessionStorage.getItem('app_lang');
    const langToUse = savedLang ?? 'en';

    this.lastLang = langToUse;

    this.translate.setDefaultLang('en');
    this.translate.use(langToUse);

    //this.startVersionCheckInterval();
  }

  // private startVersionCheckInterval() {
  //   this.intervalId = setInterval(() => {
  //     this.translationService.initVersionCheck();
  //   }, 30 * 60 * 1000);
  // }

  changeLang(lang: string) {
    //this.translate.reloadLang(lang);
    this.translate.use(lang);

    this.lastLang = lang;
    sessionStorage.setItem('app_lang', lang); 
  }
}