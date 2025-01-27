import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StringFunctions {
 
    /**
     * Returns a new string with the first letter capitalized.
     * @param str The string to capitalize.
     * @returns A new string with the first letter capitalized.
     */
    capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
}


