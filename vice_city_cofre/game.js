const secretCode = () => {
  const digits = [...Array(10).keys()];
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits.slice(0, 3).join('');
};

let secret = secretCode();
let entered = '';
let attempts = 0;
let unlocked = false;

const $ = (id) => document.getElementById(id);
const screenText = $('screenText');
const vaultStage = document.querySelector('.vault-stage');

function render() {
  for (let i = 0; i < 3; i++) {
    const slot = $('slot' + i);
    slot.textContent = entered[i] ?? '_';
    slot.classList.toggle('filled', Boolean(entered[i]));
  }
  $('dialNumber').textContent = entered.padEnd(3, '0');
}

function setMessage(text, type = '') {
  const message = $('message');
  message.textContent = text;
  message.className = 'message ' + type;
}

function clearCode() {
  if (unlocked) return;
  entered = '';
  render();
  screenText.textContent = 'AWAITING ACCESS CODE';
  setMessage('Código apagado. Tente novamente.');
}

function addDigit(digit) {
  if (unlocked || entered.length >= 3) return;
  entered += digit;
  render();
  screenText.textContent = 'CODE: ' + entered.padEnd(3, '•');
  if (entered.length === 3) setMessage('Código pronto. Confirme para tentar abrir.');
}

function submitCode() {
  if (unlocked) return;
  if (entered.length !== 3) {
    setMessage('Digite os três números antes de confirmar.', 'error');
    return;
  }

  attempts++;
  $('attempts').textContent = attempts;

  if (entered === secret) {
    unlocked = true;
    vaultStage.classList.add('vault-open');
    $('lockStatus').textContent = 'LIBERADO';
    $('lockStatus').style.color = '#43e8ed';
    $('hint').textContent = 'Combinação identificada. O mecanismo foi liberado.';
    $('dialNumber').textContent = secret;
    screenText.textContent = 'ACCESS GRANTED';
    setMessage('Acesso concedido!', 'good');
    $('winningCode').textContent = secret;
    $('winOverlay').classList.remove('hidden');
    return;
  }

  const correctDigits = [...entered].filter((digit, i) => digit === secret[i]).length;
  const secretDigits = new Set(secret);
  const presentDigits = [...entered].filter(digit => secretDigits.has(digit)).length;
  let clue;

  if (correctDigits > 0) {
    clue = `${correctDigits} número(s) estão na posição correta. ${presentDigits - correctDigits} outro(s) aparecem, mas em posição diferente.`;
  } else if (presentDigits > 0) {
    clue = `${presentDigits} número(s) fazem parte da combinação, mas nenhum está na posição correta.`;
  } else {
    clue = 'Nenhum dos números digitados faz parte da combinação.';
  }

  $('hint').textContent = clue;
  screenText.textContent = 'ACCESS DENIED';
  setMessage('Combinação incorreta. Analise a pista e tente de novo.', 'error');
  entered = '';
  render();
}

function newGame() {
  secret = secretCode();
  entered = '';
  attempts = 0;
  unlocked = false;
  vaultStage.classList.remove('vault-open');
  $('attempts').textContent = '0';
  $('lockStatus').textContent = 'BLOQUEADO';
  $('lockStatus').style.color = '';
  $('hint').textContent = 'A combinação possui três números diferentes. Faça uma tentativa para receber a primeira pista.';
  $('winOverlay').classList.add('hidden');
  screenText.textContent = 'AWAITING ACCESS CODE';
  setMessage('Nova missão iniciada. Boa sorte.');
  render();
}

$('keypad').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.key !== undefined) addDigit(button.dataset.key);
  if (button.dataset.action === 'clear') clearCode();
  if (button.dataset.action === 'enter') submitCode();
});

$('clearBtn').addEventListener('click', clearCode);
$('submitBtn').addEventListener('click', submitCode);
$('newGameBtn').addEventListener('click', newGame);
$('playAgainBtn').addEventListener('click', newGame);

document.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) addDigit(event.key);
  if (event.key === 'Enter') submitCode();
  if (event.key === 'Backspace' || event.key === 'Escape') clearCode();
});

render();
