/*
 * util.ts
 * author: qianqians
 * 2023/9/27
 */

export function random(min:number, max:number) : number {
    let r = Math.random();
    let n = max - min;
    return Math.floor(min + r*n);
}

export function isInteger(value: number): value is number { 
    return Math.floor(value) === value; 
  } 
     
export function isDecimal(value: number): value is number { 
    return !isInteger(value); 
  }