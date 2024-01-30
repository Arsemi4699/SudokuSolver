function CheckSudokuConstraintsFor(table, val, row, col) {
  for (var i = 0; i < 9; i++) {
    if (table[row][i] == val) return false;
  }
  for (var i = 0; i < 9; i++) {
    if (table[i][col] == val) return false;
  }
  for (var i = parseInt(row / 3) * 3; i < parseInt(row / 3) * 3 + 3; i++)
    for (var j = parseInt(col / 3) * 3; j < parseInt(col / 3) * 3 + 3; j++)
      if (table[i][j] == val) return false;
  return true;
}

function ValidationSudokuConstraintsFor(table, val, row, col) {
  for (var i = 0; i < 9; i++) {
    if (table[row][i] == val && i != col) return false;
  }
  for (var i = 0; i < 9; i++) {
    if (table[i][col] == val && i != row) return false;
  }

  for (var i = parseInt(row / 3) * 3; i < parseInt(row / 3) * 3 + 3; i++)
    for (var j = parseInt(col / 3) * 3; j < parseInt(col / 3) * 3 + 3; j++)
      if (table[i][j] == val && (i != row || j != col)) return false;
  return true;
}

function isTableNeedsToSolve(table) {
  for (var i = 0; i < 9; i++)
    for (var j = 0; j < 9; j++) {
      if (table[i][j] == 0) {
        return true;
      }
    }
  return false;
}

function MRV_H(table, row, col) {
  let MRV_V = 0;
  for (var n = 1; n < 10; n++) {
    if (CheckSudokuConstraintsFor(table, n, row, col)) {
      MRV_V += 1;
    }
  }
  return MRV_V;
}

function degree_H(table, row, col) {
  let Deg_V = 0;
  for (var i = 0; i < 9; i++) {
    if (
      table[row][i] == 0 &&
      i != col &&
      (i < parseInt(col / 3) * 3 || i > parseInt(col / 3) * 3 + 2)
    ) {
      Deg_V += 1;
    }
  }
  for (var i = 0; i < 9; i++) {
    if (
      table[i][col] == 0 &&
      i != row &&
      (i < parseInt(row / 3) * 3 || i > parseInt(row / 3) * 3 + 2)
    ) {
      Deg_V += 1;
    }
  }
  for (var i = parseInt(row / 3) * 3; i < parseInt(row / 3) * 3 + 3; i++)
    for (var j = parseInt(col / 3) * 3; j < parseInt(col / 3) * 3 + 3; j++)
      if (table[i][j] == 0 && (i != row || j != col)) {
        Deg_V += 1;
      }

  return Deg_V;
}

function LCV_H(table, row, col, blockList) {
  let lcvs = [200, 200, 200, 200, 200, 200, 200, 200, 200];

  for (var i = 1; i <= 9; i++) {
    if (CheckSudokuConstraintsFor(table, i, row, col)) {
      let domin = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (var r = 0; r < 9; r++) {
        if (domin.includes(table[r][col])) {
          domin.splice(domin.indexOf(table[r][col]), 1);
        }
      }
      for (var c = 0; c < 9; c++) {
        if (domin.includes(table[row][c])) {
          domin.splice(domin.indexOf(table[row][c]), 1);
        }
      }
      for (var r = parseInt(row / 3) * 3; r < parseInt(row / 3) * 3 + 3; r++) {
        for (var c = parseInt(col / 3) * 3; c < parseInt(col / 3) * 3 + 3; c++) {
          if (domin.includes(table[r][c])) {
            domin.splice(domin.indexOf(table[r][c]), 1);
          }
        }
      }
      lcvs[i - 1] = domin.length;
    }
  }
  blockList.forEach((e) => {
    lcvs[e - 1] = 200;
  });

  selectedValueIdx = 0;
  for (var k = 0; k < 9; k++) {
    if (lcvs[selectedValueIdx] > lcvs[k]) {
      selectedValueIdx = k;
    }
  }
  if (lcvs[selectedValueIdx] == 200)
    return 0;
  return selectedValueIdx + 1;
}

function TheBestZeroChoiceXY(table, needsDegree) {
  let finalX, finalY;
  let minPossibleNumbers = 10;
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (table[i][j] == 0) {
        let possibleNumbersForIJ = MRV_H(table, i, j);
        if (minPossibleNumbers > possibleNumbersForIJ) {
          minPossibleNumbers = possibleNumbersForIJ;
          finalX = i;
          finalY = j;
        } else if (minPossibleNumbers == possibleNumbersForIJ && needsDegree) {
          let CurrentPosDegree = degree_H(table, finalX, finalY);
          let NewPosDegree = degree_H(table, i, j);
          if (NewPosDegree > CurrentPosDegree) {
            finalX = i;
            finalY = j;
          }
        }
      }
    }
  }
  return [finalX, finalY];
}

function sudokuSolverUsingLCV(table) {
  if (isTableNeedsToSolve(table)) {
    let zeroPozXY = TheBestZeroChoiceXY(table, HSelect);
    let blockList = [];
    while (blockList.length < 9) {
      let n = LCV_H(table, zeroPozXY[0], zeroPozXY[1], blockList);
      if (CheckSudokuConstraintsFor(table, n, zeroPozXY[0], zeroPozXY[1])) {
        table[zeroPozXY[0]][zeroPozXY[1]] = n;
        if (!blockList.includes(n))
          if (n)
            blockList.push(n);
        if (sudokuSolverUsingLCV(table)) {
          return true;
        }
        table[zeroPozXY[0]][zeroPozXY[1]] = 0;
      } else {
        if (!blockList.includes(n)) {
          if (n)
            blockList.push(n);
          else
            return false;
        }
      }
    }
    return false;
  } else {
    return true;
  }
}

function sudokuSolverSimple(table) {
  if (isTableNeedsToSolve(table)) {
    let zeroPozXY = TheBestZeroChoiceXY(table, HSelect);
    for (var n = 1; n < 10; n++) {
      if (CheckSudokuConstraintsFor(table, n, zeroPozXY[0], zeroPozXY[1])) {
        table[zeroPozXY[0]][zeroPozXY[1]] = n;
        if (sudokuSolverSimple(table)) {
          return true;
        }
        table[zeroPozXY[0]][zeroPozXY[1]] = 0;
      }
    }
    return false;
  } else {
    return true;
  }
}

function sudokuGenerator(table) {
  if (isTableNeedsToSolve(table)) {
    let zeroPozXY = TheBestZeroChoiceXY(table, 1);
    blockList = [];
    while (blockList.length < 9) {
      let n = Math.floor(Math.random() * 9) + 1;
      if (CheckSudokuConstraintsFor(table, n, zeroPozXY[0], zeroPozXY[1])) {
        table[zeroPozXY[0]][zeroPozXY[1]] = n;
        if (sudokuGenerator(table)) {
          return true;
        } else {
          table[zeroPozXY[0]][zeroPozXY[1]] = 0;
        }
      } else {
        if (!blockList.includes(n)) {
          blockList.push(n);
        }
      }
    }
    return false;
  } else {
    return true;
  }
}

function printTable(table) {
  let innerHTMLtxt = `<div></div><table class="table">`;
  let zeroClass = "";
  let difftd = "";
  for (var i = 0; i < 9; i++) {
    innerHTMLtxt += "<tr>";
    for (var j = 0; j < 9; j++) {
      if (table[i][j] == 0) {
        zeroClass = "zero";
      }
      if ((parseInt(i / 3) * 3) % 2) {
        if (j < 3 || j > 5) {
          difftd = "difftd";
        }
      } else {
        if (j > 2 && j < 6) {
          difftd = "difftd";
        }
      }
      innerHTMLtxt += `<td class="${zeroClass} ${difftd}"><span class="getNum">${table[i][j]}</span></td>`;
      zeroClass = "";
      difftd = "";
    }
    innerHTMLtxt += "</tr>";
  }
  innerHTMLtxt += "</table></div>";
  InputControl.innerHTML = innerHTMLtxt;
}

function generateSudokuTable(deleteNReq) {
  let isGenerated = false;
  let newTable = [];
  do {
    newTable = [];
    for (var i = 0; i < 9; i++) {
      newTable.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    isGenerated = sudokuGenerator(newTable);
    if (isGenerated) {
      console.log("generated");
      let deletedN = 0;
      deleteNReq = deleteNReq > 81 ? 81 : deleteNReq;
      deleteNReq = deleteNReq < 0 ? 0 : deleteNReq;
      while (deletedN < deleteNReq) {
        let i = Math.floor(Math.random() * 9);
        let j = Math.floor(Math.random() * 9);
        if (newTable[i][j] != 0) {
          newTable[i][j] = 0;
          deletedN += 1;
        }
      }
    }
  } while (!isGenerated);
  return newTable;
}

function randomAction() {
  deletedN = Number(document.getElementById("randomSteps").value);
  Gtable = generateSudokuTable(deletedN);
  printTable(Gtable);
  CtrlRunBox(1);
}

function fileAction() {
  const fileInput = document.getElementById("selectFile");
  const selectedFile = fileInput.files[0];
  let InTable = [];
  let txtFile = "";
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      txtFile = e.target.result;
      txtArray = txtFile.split("\n");
      for (var i = 0; i < 9; i++) {
        InTable.push(txtArray[i].split(" "));
      }
      let isValid = tableValidation(InTable);
      if (isValid == 1) {
        Gtable = InTable;
        setMessage("tipWait", "Sudoku Imported");
      } else if (isValid == 0) {
        setMessage("tipError", "Sudoku violates Constraints");
        return;
      } else if (isValid == -1) {
        setMessage("tipError", "invalid inputs");
        return;
      }
      printTable(Gtable);
      CtrlRunBox(1);
    };
    reader.readAsText(selectedFile);
  } else {
    setMessage("tipError", "No file selected");
    return;
  }
}

function updateInput() {
  if (InputSelect == 0) {
    difftd = "";
    let OutHtml = `
    <div>
    <table class="table">
    `;
    for (var i = 0; i < 9; i++) {
      OutHtml += `<tr>`;
      for (var j = 0; j < 9; j++) {
        if ((parseInt(i / 3) * 3) % 2) {
          if (j < 3 || j > 5) {
            difftd = "difftd";
          }
        } else {
          if (j > 2 && j < 6) {
            difftd = "difftd";
          }
        }
        OutHtml += `<td><input class="getNum ${difftd}" id="r${i}c${j}" type="text" maxlength="1"></td>`;
        difftd = "";
      }
      OutHtml += `</tr>`;
    }
    OutHtml += `
    </div>
    </table>`;
    InputControl.innerHTML = OutHtml;
  }
  if (InputSelect == 1) {
    InputControl.innerHTML = `
      <div>
        <label for="randomSteps">Number empty spaces:</label>
        <input type="number" id="randomSteps" value="1"/>
        <button id="updateRandPuzzle">new puzzle</button>
      </div>`;
    document
      .getElementById("updateRandPuzzle")
      .addEventListener("click", () => {
        randomAction();
      });
  }
  if (InputSelect == 2) {
    InputControl.innerHTML = `
      <div>
        <label for="selectFile">File:</label>
        <input type="file" id="selectFile"/>
      </div>`;
    document.getElementById("selectFile").addEventListener("change", () => {
      fileAction();
    });
  }
}

function tableValidation(table) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (isNaN(table[j][i])) return -1;
      if (table[i][j] != 0) {
        if (!ValidationSudokuConstraintsFor(table, table[i][j], i, j)) return 0;
      }
    }
  }
  return 1;
}

function solve() {
  setMessage("", "");
  if (InputSelect == 0) {
    let InTable = [[], [], [], [], [], [], [], [], []];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        InTable[i][j] = Number(document.getElementById(`r${i}c${j}`).value);
      }
    }
    let isValid = tableValidation(InTable);
    if (isValid == 1) {
      Gtable = InTable;
    } else if (isValid == 0) {
      setMessage("tipError", "Sudoku violates Constraints");
      return;
    } else if (isValid == -1) {
      setMessage("setMessage", "invalid inputs");
      return;
    }
  }

  if (Gtable != null) {
    setMessage("tipWait", "Loading...");
    let copyTable = Gtable.slice().map(row => row.slice());

    var startTime = performance.now();
    setTimeout(() => {
      let isSolved = false;
      if (HSelect != 2) {
        isSolved = sudokuSolverSimple(copyTable);
      } else {
        isSolved = sudokuSolverUsingLCV(copyTable);
      }
      if (isSolved) {
        var endTime = performance.now();
        let timerMS = (endTime - startTime).toFixed(2);
        CtrlretryBtn(1);
        console.log("done");
        setMessage("tipSucess", "solved in " + timerMS + "ms");
        printTable(copyTable);
        CtrlRunBox(0);
      } else {
        setMessage("tipError", "not solvable!");
      }
    }, 1);
  }
}

function setMessage(className, info) {
  if (className) tipbox.classList = [className];
  else tipbox.classList = [];
  tipbox.innerHTML = info;
}

function CtrlRunBox(show) {
  if (show) {
    if (runBox.classList.contains("hideSolveBtn"))
      runBox.classList.remove("hideSolveBtn");
  } else {
    if (!runBox.classList.contains("hideSolveBtn"))
      runBox.classList.add("hideSolveBtn");
  }
}

function CtrlretryBtn(show) {
  if (show) {
    if (retryBtn.classList.contains("hideSolveBtn"))
      retryBtn.classList.remove("hideSolveBtn");
  } else {
    if (!retryBtn.classList.contains("hideSolveBtn"))
      retryBtn.classList.add("hideSolveBtn");
  }
}

var deletedN = 1;
var Gtable = null;
const manualInputRadio = document.getElementById("manualInput");
const randomInputRadio = document.getElementById("randomInput");
const fileInputRadio = document.getElementById("fileInput");
const InputControl = document.getElementById("inputControl");

const runBtn0 = document.getElementById("run0");
const runBtn1 = document.getElementById("run1");
const runBtn2 = document.getElementById("run2");
const retryBtn = document.getElementById("retry");
const runBox = document.getElementById("runBox");
const tipbox = document.getElementById("tip");
var InputSelect = 0;
var HSelect = 0;

updateInput();

manualInputRadio.addEventListener("click", () => {
  InputSelect = 0;
  CtrlretryBtn(0);
  setMessage("", "");
  CtrlRunBox(1);
  updateInput();
});
randomInputRadio.addEventListener("click", () => {
  InputSelect = 1;
  CtrlretryBtn(0);
  setMessage("", "");
  CtrlRunBox(0);
  updateInput();
});
fileInputRadio.addEventListener("click", () => {
  InputSelect = 2;
  CtrlretryBtn(0);
  setMessage("", "");
  CtrlRunBox(0);
  updateInput();
});
retryBtn.addEventListener("click", () => {
  CtrlretryBtn(0);
  setMessage("", "");
  printTable(Gtable);
  CtrlRunBox(1);
  InputSelect = 3;
});
runBtn0.addEventListener("click", () => {
  HSelect = 0;
  solve();
});
runBtn1.addEventListener("click", () => {
  HSelect = 1;
  solve();
});
runBtn2.addEventListener("click", () => {
  HSelect = 2;
  solve();
});
