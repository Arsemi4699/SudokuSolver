# Sudoku Solver

## Overview

This repository contains a Sudoku solver implemented in JavaScript, with an HTML and CSS-based user interface. The solver uses the backtracking algorithm with Minimum Remaining Values (MRV), Degree, and Least Constraining Value (LCV) heuristics for efficient solving. The application supports three input methods: manual input, file input, and random generation.

## Features

- Solve Sudoku puzzles using the backtracking algorithm.
- Three input methods:
  - Manual input: Input the initial puzzle state manually.
  - File input: Upload a file containing a Sudoku puzzle.
  - Random generation: Generate a random Sudoku puzzle.

## Usage

### Manual Input

1. Open `index.html` in a web browser.
2. Select the "Manual Input" option.
3. Enter the initial Sudoku puzzle values by clicking on cells.

### File Input

1. Open `index.html` in a web browser.
2. Select the "File Input" option.
3. Click on the "Upload" button and select a file containing a Sudoku puzzle.

### Random Generation

1. Open `index.html` in a web browser.
2. Select the "Random Generation" option.
3. Adjust difficulty settings by change number of empty cells and click on the "Generate" button.

## How to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/Arsemi4699/SudokuSolver.git
cd SudokuSolver
