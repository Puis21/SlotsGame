import './style.css';
import Phaser from 'phaser';

const windowSize = {
  width: 1250,
  height: 750
};

class GameScene extends Phaser.Scene {
  constructor() {
    super('super-game');

    this.isSpinning = false;
    this.spinStartTime = 0;
    this.spinDuration = 2000; // Total duration of spin
    this.spinSpeed = 15; // Speed at which symbols move
    this.columnStopDelay = 400; // Delay between stopping columns
    this.columnStopTimes = []; // Array to track when each column should stop
    this.balance = 1000; // Starting balance
    this.spinCost = 100;
    this.autoSpins = 10;
    this.isAutoSpinning = false;
    this.autoSpinInterval = null;

    //Payout table
    this.payoutTable = {
      '9': { 3: 10, 4: 20, 5: 30 },
      '10': { 3: 15, 4: 25, 5: 35 },
      'J': { 3: 15, 4: 25, 5: 35 },
      'Q': { 3: 20, 4: 30, 5: 40 },
      'K': { 3: 25, 4: 35, 5: 45 },
      'A': { 3: 20, 4: 30, 5: 40 },
      'Seven': { 3: 50, 4: 75, 5: 100 },
      'Bell': { 3: 30, 4: 50, 5: 70 }
    };
  }

  preload() {
    this.updateBalanceDisplay();

    // Load images for all symbols
    this.load.image('9', 'SlotGame/assets/9.png');
    this.load.image('10', 'SlotGame/assets/10.png');
    this.load.image('A', 'SlotGame/assets/A.png');
    this.load.image('K', 'SlotGame/assets/K.png');
    this.load.image('Seven', 'SlotGame/assets/Seven.png');
    this.load.image('Bell', 'SlotGame/assets/H6.png');
    this.load.image('J', 'SlotGame/assets/J.png');
    this.load.image('Q', 'SlotGame/assets/Q.png');

    // Load connect images for all symbols
    this.load.image('9_connect', 'SlotGame/assets/9_connect.png');
    this.load.image('10_connect', 'SlotGame/assets/10_connect.png');
    this.load.image('A_connect', 'SlotGame/assets/A_connect.png');
    this.load.image('K_connect', 'SlotGame/assets/K_connect.png');
    this.load.image('Seven_connect', 'SlotGame/assets/Seven_connect.png');
    this.load.image('Bell_connect', 'SlotGame/assets/H6_connect.png');
    this.load.image('J_connect', 'SlotGame/assets/J_connect.png');
    this.load.image('Q_connect', 'SlotGame/assets/Q_connect.png');

    //load some sounds
    this.load.audio('anyWin', 'SlotGame/sounds/anyWin.wav');
    this.load.audio('spinning', 'SlotGame/sounds/spinning.wav');

  }

  create() {
    this.cols = 5;
    this.rows = 3;
    this.symbolSize = 250;
    this.margin = 0;

    this.anyWin = this.sound.add('anyWin', { volume: 0.25 });
    this.spinning = this.sound.add('spinning', { volume: 0.2 }); 

    // Define symbols and their probabilities for each reel
    this.symbolProbabilities = [
      { '9': 0.1, '10': 0.1, 'A': 0.1, 'K': 0.1, 'Seven': 0.2, 'Bell': 0.1, 'J': 0.1, 'Q': 0.1 }, // Reel 0
      { '9': 0.1, '10': 0.1, 'A': 0.1, 'K': 0.1, 'Seven': 0.2, 'Bell': 0.1, 'J': 0.1, 'Q': 0.1 }, // Reel 1
      { '9': 0.1, '10': 0.1, 'A': 0.1, 'K': 0.1, 'Seven': 0.2, 'Bell': 0.1, 'J': 0.1, 'Q': 0.1 }, // Reel 2
      { '9': 0.1, '10': 0.1, 'A': 0.1, 'K': 0.1, 'Seven': 0.2, 'Bell': 0.1, 'J': 0.1, 'Q': 0.1 }, // Reel 3
      { '9': 0.1, '10': 0.1, 'A': 0.1, 'K': 0.1, 'Seven': 0.2, 'Bell': 0.1, 'J': 0.1, 'Q': 0.1 }  // Reel 4
    ];

    // // TEST SYMBOLS
    // this.symbolProbabilities = [
    //   { '9': 0, '10': 0, 'A': 0, 'K': 0, 'Seven': 1, 'Bell': 0, 'J': 0, 'Q': 0 }, // Reel 0
    //   { '9': 0, '10': 0, 'A': 0, 'K': 0, 'Seven': 1, 'Bell': 0, 'J': 0, 'Q': 0 }, // Reel 1
    //   { '9': 0, '10': 0, 'A': 0, 'K': 0, 'Seven': 1, 'Bell': 0, 'J': 0, 'Q': 0 }, // Reel 2
    //   { '9': 0, '10': 0, 'A': 0, 'K': 0, 'Seven': 1, 'Bell': 0, 'J': 0, 'Q': 0 }, // Reel 3
    //   { '9': 0, '10': 0, 'A': 0, 'K': 0, 'Seven': 1, 'Bell': 0, 'J': 0, 'Q': 0 }  // Reel 4
    // ];

    this.symbols = Object.keys(this.symbolProbabilities[0]); // All possible symbols

    this.reels = [];
    this.result = [];

    for (let col = 0; col < this.cols; col++) {
      const reel = [];
      for (let row = 0; row < this.rows + 4; row++) { // Extra rows for smooth scrolling
        const symbol = this.add.image(
          col * (this.symbolSize + this.margin) + this.symbolSize / 2,
          row * (this.symbolSize + this.margin) - (this.symbolSize * 3) / 2, // Adjust initial position
          '9' // Default symbol, will be replaced
        ).setDisplaySize(this.symbolSize, this.symbolSize);
        symbol.rowIndex = row; // Set row index for the symbol
        reel.push(symbol);
      }
      this.reels.push(reel);
    }

    //Spin button
    document.getElementById('spinButton').addEventListener('click', () => {

      buttonSound.play(); 
      if (this.balance >= this.spinCost && !this.isSpinning && !this.isAutoSpinning) {
        this.balance -= this.spinCost;
        this.updateBalanceDisplay();
        this.spinReels();
      }
    });

    //Add balance button
    document.getElementById('addBalanceButton').addEventListener('click', () => {
      
    this.balance += 1000;  
    this.updateBalanceDisplay();
    buttonSound.play(); 

    });

    // Auto spin button
    document.getElementById('autoSpinButton').addEventListener('click', async () => {
      // Toggle the auto spin flag
      this.isAutoSpinning = !this.isAutoSpinning;
    
      // If auto spin is turned off, reset the auto spins count
      if (!this.isAutoSpinning) {
        this.autoSpins = 0;
        return;
      }
    
      // Set the auto spins count
      this.autoSpins = 10;
    
      buttonSound.play(); 
      const autoSpin = async () => {
        while (this.autoSpins > 0 && this.isAutoSpinning && this.balance >= this.spinCost) {
          // Ensure no concurrent spins
          if (!this.isSpinning) {
            this.spinReels();
    
            // Wait for the spin to finish
            await new Promise(resolve => {
              const checkSpinning = setInterval(() => {
                if (!this.isSpinning) {
                  clearInterval(checkSpinning);
                  resolve();
                }
              }, 100); // Check every 100ms if the spin has finished
            });
    
            // Add delay between spins
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            this.autoSpins--;
    
            // If no spins left, reset the auto spin flag
            if (this.autoSpins === 0) {
              this.isAutoSpinning = false;
            }
          } else {
            // If spinning is still happening, wait a bit and check again
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      };
    
      // Start the auto spin process
      autoSpin();
    });

  }


  spinReels() {
    if (this.isSpinning) return; // Prevent multiple spins at the same time
    
    this.isSpinning = true;
    this.spinStartTime = this.time.now;
  
    // Generate results for each symbol in each reel based on probabilities
    this.result = this.reels.map((_, col) => {
      return Array.from({ length: this.rows }, () => 
        this.getSymbolBasedOnProbability(this.symbolProbabilities[col])
      );
    });
  
    // Set initial symbols for each reel
    this.reels.forEach((reel, col) => {
      reel.forEach((symbol, index) => {
        if (index < this.rows) {
          // Set initial symbol for visible symbols
          symbol.setTexture(this.result[col][index]);
        } else {
          // Set initial symbol for extra symbols
          symbol.setTexture(Phaser.Math.RND.pick(this.symbols));
        }
        // Position the symbol
        symbol.y = (index - this.rows) * this.symbolSize; // Position based on index
      });
    });
  
    // Calculate stop times for each column
    this.columnStopTimes = Array.from({ length: this.cols }, (_, index) => 
      this.spinStartTime + this.spinDuration + (index * this.columnStopDelay)
    );
  }
  
  update() {

    //Move each reel and randomize spins
    if (this.isSpinning) {
      this.reels.forEach((reel, col) => {
        if (this.time.now >= this.spinStartTime) {
          reel.forEach((symbol) => {
            symbol.y += this.spinSpeed;
  
            if (symbol.y > this.game.config.height + this.symbolSize) {
              symbol.y = -this.symbolSize;
              if (symbol.texture.key !== this.result[col][symbol.rowIndex]) {
                symbol.setTexture(Phaser.Math.RND.pick(this.symbols));
              }
            }
          });
  
          if (this.time.now >= this.columnStopTimes[col]) {
            reel.forEach((symbol, index) => {
              if (index < this.rows) {
                symbol.setTexture(this.result[col][index]);
              }
  
              const symbolY = ((this.rows * this.symbolSize) / 6) + (index * this.symbolSize);
              symbol.y = symbolY;
            });
          }
        }
      });
  
      if (this.reels.every((_, col) => this.time.now >= this.columnStopTimes[col])) {
        this.isSpinning = false;
        const payout = this.checkForWin(); // Check for wins
        this.updateBalance(payout); // Update balance with the payout
  
        // Apply glowing textures to winning symbols
        this.applyWinningTextures();
      }
    }
  
    if (!this.isSpinning) {
      this.spinning.play();
    }
  }
  
  applyWinningTextures() {
    this.winningSymbols.forEach(winning => {
      winning.positions.forEach(([row, col]) => {
        const symbol = this.reels[col][row];
        symbol.setTexture(`${winning.symbol}_connect`); // Set glowing texture
      });
    });
  }

  getSymbolBasedOnProbability(probabilities) {
    const symbols = Object.keys(probabilities);
    const probs = Object.values(probabilities);
    const sum = probs.reduce((a, b) => a + b, 0);

    let rand = Math.random() * sum;
  
    for (let i = 0; i < symbols.length; i++) {
      rand -= probs[i];
      if (rand <= 0) {
        return symbols[i];
      }
    }
  
    return symbols[symbols.length - 1]; // Fallback in case of rounding errors
  }

  checkForWin() {
    let payout = 0;
    this.winningSymbols = []; // Array to store winning symbols with their positions

    // Check each row
    for (let row = 0; row < this.rows; row++) {
        let rowSymbols = this.reels.map(reel => reel[row].texture.key);
        let count = 1;
        let lastSymbol = rowSymbols[0];
        let positions = [[row, 0]];

        //Loop through each row
        for (let i = 1; i < rowSymbols.length; i++) {
            if (rowSymbols[i] === lastSymbol) {
                count++;
                positions.push([row, i]);
            } else {
                if (count >= 3) {
                    const winPayout = this.calculatePayout(lastSymbol, count);
                    payout += winPayout;
                    this.winningSymbols.push({ symbol: lastSymbol, positions });
                    console.log(`Row ${row} Win: ${count} ${lastSymbol}s at positions ${JSON.stringify(positions)}. Payout: ${winPayout}`);
                }
                count = 1;
                lastSymbol = rowSymbols[i];
                positions = [[row, i]];
            }
        }

        if (count >= 3) {
            const winPayout = this.calculatePayout(lastSymbol, count);
            payout += winPayout;
            this.winningSymbols.push({ symbol: lastSymbol, positions });
            console.log(`Row ${row} Win: ${count} ${lastSymbol}s at positions ${JSON.stringify(positions)}. Payout: ${winPayout}`);
        }
    }

    // Check diagonals
    const diagonals = [
        { name: 'Diagonal 1', positionsArray: [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]] },
        { name: 'Diagonal 2', positionsArray: [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]] },
        { name: 'Diagonal 3', positionsArray: [[0, 0], [1, 1], [2, 2], [2, 3], [2, 4]] },
        { name: 'Diagonal 4', positionsArray: [[2, 0], [1, 1], [0, 2], [0, 3], [0, 4]] }
    ];

    //Loop through each Diagonal
    diagonals.forEach(({ name, positionsArray }) => {
        let diagSymbols = positionsArray.map(([row, col]) => this.reels[col][row].texture.key);
        let count = 1;
        let lastDiagSymbol = diagSymbols[0];
        let diagPositions = [positionsArray[0]];

        for (let i = 1; i < diagSymbols.length; i++) {
            if (diagSymbols[i] === lastDiagSymbol) {
                count++;
                diagPositions.push(positionsArray[i]);
            } else {
                if (count >= 3) {
                    const winPayout = this.calculatePayout(lastDiagSymbol, count);
                    payout += winPayout;
                    this.winningSymbols.push({ symbol: lastDiagSymbol, positions: diagPositions });
                    console.log(`${name} Win: ${count} ${lastDiagSymbol}s at positions ${JSON.stringify(diagPositions)}. Payout: ${winPayout}`);
                }
                count = 1;
                lastDiagSymbol = diagSymbols[i];
                diagPositions = [positionsArray[i]];
            }
        }

        if (count >= 3) {
            const winPayout = this.calculatePayout(lastDiagSymbol, count);
            payout += winPayout;
            this.winningSymbols.push({ symbol: lastDiagSymbol, positions: diagPositions });
            console.log(`${name} Win: ${count} ${lastDiagSymbol}s at positions ${JSON.stringify(diagPositions)}. Payout: ${winPayout}`);
        }
    });

    return payout;
}

    
calculatePayout(symbol, count) {
  if (this.payoutTable[symbol] && this.payoutTable[symbol][count]) {
    return this.payoutTable[symbol][count];
  }
  return 0; // No payout if the symbol or count is not in the table
}
  
updateBalance(amount) {

  if(amount > 0)
  { 
    this.anyWin.play();

    this.balance += amount;
    this.updateBalanceDisplay();
    
    // Display the win amount
    const winContainer = document.getElementById('winContainer');
    winContainer.textContent = `+ $${amount}`;
      
    // Make sure the win amount is visible
    winContainer.style.opacity = '1';
    winContainer.style.fontSize = 16;
      
    // Hide the win amount after 0.5 seconds
    setTimeout(() => {
      winContainer.style.opacity = '0';
    }, 2000);
  }


  console.log(`You won ${amount} credits! Current balance: ${this.balance}`);
}

  updateBalanceDisplay() {
    const balanceContainer = document.getElementById('balanceContainer');
    if (balanceContainer) {
      balanceContainer.textContent = `Balance: $${this.balance}`;
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: windowSize.width,
  height: windowSize.height,
  scene: GameScene,
  parent: 'slotContainer',
  backgroundColor: '#000000'
};

const game = new Phaser.Game(config);
