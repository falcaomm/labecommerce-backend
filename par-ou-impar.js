function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const parOuImpar = process.argv[2]
const devNumber = Number(process.argv[3])
const computerNumber = getRndInteger(0, 10)

const soma = computerNumber + devNumber

if (soma / 2 === 0 && parOuImpar === 'par') {
    console.log(`Você escolheu par e o computador escolheu impar. O resultado foi ${soma}. Você ganhou!`);
} else if (soma / 2 !== 0 && parOuImpar === 'impar'){
    console.log(`Você escolheu impar e o computador escolheu par. O resultado foi ${soma}. Você ganhou!`);
} else if (soma / 2 === 0 && parOuImpar === 'impar') {
    console.log(`Você escolheu impar e o computador escolheu par. O resultado foi ${soma}. Você perdeu!`);
} else if (soma / 2 !== 0 && parOuImpar === 'par') {
    console.log(`Você escolheu par e o computador escolheu impar. O resultado foi ${soma}. Você perdeu!`);
}


console.log(computerNumber);