

// Math Random = menggenerate random number antara 0 - 1
var random = Math.random();
console.log('Generate angka random = ' + random);

// Math Floor = membulatkan angka desimal kebawah
var decimalDown = Math.floor(1.6);
console.log('Decimal Down 1,6 menjadi = ' + decimalDown);

// Math Round = membulatkan angka desimal keatas
var decimalUp = Math.round(1.6);
console.log('Decimal Up 1,6 menjadi = ' + decimalUp);

// Factorial
function factorial(n){
    let answer = 1;
    if (n == 0 || n == 1){
        return answer;
    }
    else if (n > 1){
        for(var i = n; i >= 1; i--){
            answer = answer * i;
        }
        return answer;
    }
    else {
        return "number has to be positive"
    }
}
let n = 4;
answer = factorial(n);
console.log("Factorial dari "+ n + " adalah " + answer);

// Program to reverse a string
const str = 'Haris Abdullah';
const reverseWords = str => {
    let reversed = '';
    reversed = str.split(" ")
    .map(word => {
        return word
        .split("")
        .reverse()
        .join("");
    })
    .join(" ");
    return reversed;
};
console.log('Membalik Huruf '+ reverseWords(str));

// Reverse word in string javcascript
const strs = 'Haris Abdullah';
const reverseWord = (str = '') => {
    const strArr = str.split(' ');
    strArr.reverse();
    const reversedStrs = strArr.join(' ');
    return reversedStrs;
};
console.log('Membalik Kata ' + reverseWord(str));