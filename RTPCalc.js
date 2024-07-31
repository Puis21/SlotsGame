// Symbol probabilities and payout table
const symbolProbabilities = [
     { '9': 0.4, '10': 0.4, 'A': 0.3, 'K': 0.2, 'Seven': 0.3, 'Bell': 0.3, 'J': 0.3, 'Q': 0.3 },
    { '9': 0.4, '10': 0.4, 'A': 0.3, 'K': 0.2, 'Seven': 0.3, 'Bell': 0.3, 'J': 0.3, 'Q': 0.3 },
    { '9': 0.4, '10': 0.4, 'A': 0.3, 'K': 0.2, 'Seven': 0.2, 'Bell': 0.3, 'J': 0.3, 'Q': 0.3 },
    { '9': 0.4, '10': 0.4, 'A': 0.3, 'K': 0.2, 'Seven': 0.2, 'Bell': 0.2, 'J': 0.3, 'Q': 0.3 },
    { '9': 0.4, '10': 0.4, 'A': 0.3, 'K': 0.2, 'Seven': 0.2, 'Bell': 0.2, 'J': 0.3, 'Q': 0.3 }
];

const payoutTable = {
 '9': { 3: 20, 4: 30, 5: 45 },
    '10': { 3: 25, 4: 35, 5: 50 },
    'J': { 3: 30, 4: 40, 5: 65 },
    'Q': { 3: 30, 4: 40, 5: 65 },
    'K': { 3: 40, 4: 70, 5: 100 },
    'A': { 3: 35, 4: 50, 5: 80 },
    'Seven': { 3: 50, 4: 100, 5: 150 },
    'Bell': { 3: 40, 4: 80, 5: 120 }
};

// Function to calculate expected payout
function calculateExpectedPayout(symbol, symbolProbabilities, payoutTable) {
  const probabilities = symbolProbabilities.map(reel => reel[symbol]);
  const prob3 = probabilities[0] * probabilities[1] * probabilities[2];
  const prob4 = prob3 * probabilities[3];
  const prob5 = prob4 * probabilities[4];
  const payout3 = payoutTable[symbol][3] * prob3;
  const payout4 = payoutTable[symbol][4] * prob4;
  const payout5 = payoutTable[symbol][5] * prob5;
  return payout3 + payout4 + payout5;
}

// Calculate total expected payout
let totalExpectedPayout = 0;
for (const symbol in payoutTable) {
  totalExpectedPayout += calculateExpectedPayout(symbol, symbolProbabilities, payoutTable);
}

// Multiply by number of winlines
totalExpectedPayout *= 7;

// RTP Calculation
const totalBet = 100; // Adjusted to 100 units per spin
const RTP = (totalExpectedPayout / totalBet) * 100;

// Print the result
console.log(`The RTP of the slot machine is ${RTP.toFixed(2)}%`);
