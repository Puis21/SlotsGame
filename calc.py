# Symbol probabilities and payout table
symbol_probabilities = [
    { '9': 0.4, '10': 0.4, 'A': 0.3, 'K': 0.2, 'Seven': 0.3, 'Bell': 0.3, 'J': 0.3, 'Q': 0.3 },
    { '9': 0.4, '10': 0.4, 'A': 0.3, 'K': 0.2, 'Seven': 0.3, 'Bell': 0.3, 'J': 0.3, 'Q': 0.3 },
    { '9': 0.4, '10': 0.4, 'A': 0.3, 'K': 0.2, 'Seven': 0.2, 'Bell': 0.3, 'J': 0.3, 'Q': 0.3 },
    { '9': 0.4, '10': 0.4, 'A': 0.3, 'K': 0.2, 'Seven': 0.2, 'Bell': 0.2, 'J': 0.3, 'Q': 0.3 },
    { '9': 0.4, '10': 0.4, 'A': 0.3, 'K': 0.2, 'Seven': 0.2, 'Bell': 0.2, 'J': 0.3, 'Q': 0.3 }
]

payout_table = {
    '9': { 3: 20, 4: 30, 5: 45 },
    '10': { 3: 25, 4: 35, 5: 50 },
    'J': { 3: 30, 4: 40, 5: 65 },
    'Q': { 3: 30, 4: 40, 5: 65 },
    'K': { 3: 40, 4: 70, 5: 100 },
    'A': { 3: 35, 4: 50, 5: 80 },
    'Seven': { 3: 50, 4: 100, 5: 150 },
    'Bell': { 3: 40, 4: 80, 5: 120 }
}

# Function to calculate expected payout
def calculate_expected_payout(symbol, symbol_probabilities, payout_table):
    probabilities = [reel[symbol] for reel in symbol_probabilities]
    prob_3 = probabilities[0] * probabilities[1] * probabilities[2]
    prob_4 = prob_3 * probabilities[3]
    prob_5 = prob_4 * probabilities[4]
    payout_3 = payout_table[symbol][3] * prob_3
    payout_4 = payout_table[symbol][4] * prob_4
    payout_5 = payout_table[symbol][5] * prob_5
    return payout_3 + payout_4 + payout_5

# Calculate total expected payout
total_expected_payout = 0
for symbol in payout_table.keys():
    total_expected_payout += calculate_expected_payout(symbol, symbol_probabilities, payout_table)

# Multiply by number of winlines
total_expected_payout *= 7

# RTP Calculation
total_bet = 100  # Adjusted to 100 units per spin
RTP = (total_expected_payout / total_bet) * 100

# Print the result
print(f"The RTP of the slot machine is {RTP:.2f}%")
