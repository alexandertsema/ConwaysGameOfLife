enum Neighborhood {
  Upper,
  Bottom,
  Left,
  Right,
  LeftBottom,
  RightBottom,
  LeftUpper,
  RightUpper
}

class Cell {
  private _id: number;
  get id(): string {
    return this._id.toString();
  }
  readonly x: number;
  readonly y: number;
  isAlive: boolean;
  htmlElement: HTMLElement;
  readonly neighbors: Neighbors;

  constructor(id: number, x: number, y: number) {
    this._id = id;
    this.x = x;
    this.y = y;
    this.isAlive = false;
    this.htmlElement = null;
    this.neighbors = new Neighbors();
  }

  kill = (): void => {
    this.htmlElement.classList.add("dead");
    this.htmlElement.classList.remove("alive");
    this.isAlive = false;
  };

  giveBirth = (): void => {
    this.htmlElement.classList.add("alive");
    this.htmlElement.classList.remove("dead");
    this.isAlive = true;
  };
}

class Neighbors {
  upperNeighbor: Cell;
  bottomNeighbor: Cell;
  leftNeighbor: Cell;
  rightNeighbor: Cell;
  leftBottomNeighbor: Cell;
  rightBottomNeighbor: Cell;
  leftUpperNeighbor: Cell;
  rightUpperNeighbor: Cell;
  get aliveNeighbors() {
    return (
      (() => {
        return this.upperNeighbor ? (this.upperNeighbor.isAlive ? 1 : 0) : 0;
      })() +
      (() => {
        return this.bottomNeighbor ? (this.bottomNeighbor.isAlive ? 1 : 0) : 0;
      })() +
      (() => {
        return this.leftNeighbor ? (this.leftNeighbor.isAlive ? 1 : 0) : 0;
      })() +
      (() => {
        return this.rightNeighbor ? (this.rightNeighbor.isAlive ? 1 : 0) : 0;
      })() +
      (() => {
        return this.leftBottomNeighbor ? (this.leftBottomNeighbor.isAlive ? 1 : 0) : 0;
      })() +
      (() => {
        return this.rightBottomNeighbor ? (this.rightBottomNeighbor.isAlive ? 1 : 0) : 0;
      })() +
      (() => {
        return this.leftUpperNeighbor ? (this.leftUpperNeighbor.isAlive ? 1 : 0) : 0;
      })() +
      (() => {
        return this.rightUpperNeighbor ? (this.rightUpperNeighbor.isAlive ? 1 : 0) : 0;
      })()
    );
  }
}

class Grid {
  readonly rows: number;
  readonly columns: number;
  matrix: Cell[][];

  constructor(columns: number, rows: number) {
    this.rows = rows;
    this.columns = columns;
    this.matrix = this.initMatrix(rows, columns);
  }

  private initMatrix = (rows: number, columns: number): Cell[][] => {
    let counter = 0;
    let matrix = [];
    for (let r = 0; r < rows; r++) {
      matrix[r] = [];
      for (let c = 0; c < columns; c++) {
        matrix[r][c] = new Cell(counter++, c, r);
      }
    }
    matrix = this.populateNeighbors(matrix);
    return matrix;
  };

  private populateNeighbors = (matrix: Cell[][]): Cell[][] => {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let cell = matrix[r][c];
        if (matrix[r - 1]) cell.neighbors.upperNeighbor = matrix[r - 1][c];
        if (matrix[r + 1]) cell.neighbors.bottomNeighbor = matrix[r + 1][c];
        if (matrix[r][c - 1]) cell.neighbors.leftNeighbor = matrix[r][c - 1];
        if (matrix[r][c + 1]) cell.neighbors.rightNeighbor = matrix[r][c + 1];
        if (matrix[r - 1] && matrix[r - 1][c - 1]) cell.neighbors.leftUpperNeighbor = matrix[r - 1][c - 1];
        if (matrix[r + 1] && matrix[r + 1][c - 1]) cell.neighbors.leftBottomNeighbor = matrix[r + 1][c - 1];
        if (matrix[r - 1] && matrix[r - 1][c + 1]) cell.neighbors.rightUpperNeighbor = matrix[r - 1][c + 1];
        if (matrix[r + 1] && matrix[r + 1][c + 1]) cell.neighbors.rightBottomNeighbor = matrix[r + 1][c + 1];
      }
    }
    return matrix;
  };

  private getCell = (x: number, y: number): Cell => {
    return this.matrix[x][y];
  };

  private getNeighbor = (neighborhood: Neighborhood, currentCell: Cell): Cell => {
    switch (neighborhood) {
      case Neighborhood.Upper:
        return currentCell.neighbors.upperNeighbor;
      case Neighborhood.Bottom:
        return currentCell.neighbors.bottomNeighbor;
      case Neighborhood.Left:
        return currentCell.neighbors.leftNeighbor;
      case Neighborhood.Right:
        return currentCell.neighbors.rightNeighbor;
      case Neighborhood.LeftBottom:
        return currentCell.neighbors.leftBottomNeighbor;
      case Neighborhood.LeftUpper:
        return currentCell.neighbors.leftUpperNeighbor;
      case Neighborhood.RightBottom:
        return currentCell.neighbors.rightBottomNeighbor;
      case Neighborhood.RightUpper:
        return currentCell.neighbors.rightUpperNeighbor;
      default:
        break;
    }
  };

  private randomizeNeighborhood(): Neighborhood {
    const randomIndex = Math.floor(Math.random() * 7);
    var neighborhood = Neighborhood[randomIndex];
    return Neighborhood[neighborhood];
  }

  private produceGeneration = (): void => {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let cell = this.matrix[r][c];
        if (cell.isAlive) {
          if (cell.neighbors.aliveNeighbors < 2 || cell.neighbors.aliveNeighbors > 3) cell.kill();
        } else {
          if (cell.neighbors.aliveNeighbors == 3) cell.giveBirth();
        }
      }
    }
  };

  render = (): void => {
    let table = document.getElementById("grid");
    this.matrix.forEach(row => {
      let tableRow = document.createElement("tr");
      row.forEach(cell => {
        let tableCell = document.createElement("td");
        let cellDiv = document.createElement("div");
        cellDiv.id = cell.id;
        cellDiv.className = "cell";
        cell.htmlElement = cellDiv;
        tableCell.appendChild(cellDiv);
        tableRow.appendChild(tableCell);
      });
      table.appendChild(tableRow);
    });
  };

  beginLife = (): void => {
    for (let i = 0; i < 50; i++) {
        const zeroX = Math.floor(Math.random() * this.rows);
        const zeroY = Math.floor(Math.random() * this.columns);
        const zeroCell = this.getCell(zeroX, zeroY);
        if (zeroCell) zeroCell.giveBirth();
        const neighbor1 = this.getNeighbor(this.randomizeNeighborhood(), zeroCell);
        if (neighbor1) neighbor1.giveBirth();
        const neighbor2 = this.getNeighbor(this.randomizeNeighborhood(), zeroCell);
        if (neighbor2) neighbor2.giveBirth();
        const neighbor3 = this.getNeighbor(this.randomizeNeighborhood(), zeroCell);
        if (neighbor3) neighbor3.giveBirth();
        const neighbor4 = this.getNeighbor(this.randomizeNeighborhood(), zeroCell);
        if (neighbor4) neighbor4.giveBirth();
        if (neighbor3) neighbor3.giveBirth();
        const neighbor5 = this.getNeighbor(this.randomizeNeighborhood(), zeroCell);
        if (neighbor5) neighbor5.giveBirth();
    }
  };

  produceGenerations = (interval: number): void => {
    setInterval(() => {
      this.produceGeneration();
    }, interval);
  };
}

const width = 100;
const height = 55;
const generationInterval = 200;

let grid = new Grid(width, height);
grid.render();
grid.beginLife();
grid.produceGenerations(generationInterval);
