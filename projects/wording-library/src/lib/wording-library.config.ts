import { InjectionToken } from "@angular/core";

export interface WordingLibraryConfig{
    baseUrl:string;
    fileConfigVersion:string;
}

export const WORDING_LIBRARY_CONFIG = new InjectionToken<WordingLibraryConfig>('WORDING_LIBRARY_CONFIG');