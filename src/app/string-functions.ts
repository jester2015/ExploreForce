interface String {
    capitalizeFirst(): string;
  }
String.prototype.capitalizeFirst = function(): string {
  
return this.charAt(0).toUpperCase() + this.slice(1);

}