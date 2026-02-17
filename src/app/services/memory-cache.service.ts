import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
  export class MemoryCacheService<T> {

    constructor() { }

      private cache = new Map<string, T>();

    get(key: string): T | null {
      return this.cache.has(key) ? this.cache.get(key)! : null;
    }

    set(key: string, value: T): void {
      this.cache.set(key, value);
    }

    has(key: string): boolean {
      return this.cache.has(key);
    }

    clear(key?: string): void {
      if (key) this.cache.delete(key);
      else this.cache.clear();
    }
  }
