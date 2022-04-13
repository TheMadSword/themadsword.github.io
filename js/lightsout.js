function resetBoard() {
  var size = parseInt(document.querySelector('input[name="size"]:checked').value);
  regenerateBoards(size);
  refreshSolution();
}

function randomBoard() {
  var size = parseInt(document.querySelector('input[name="size"]:checked').value);
  regenerateBoards(size, true);
  var board_tiles = document.querySelectorAll(".board_tile");
  var randomBoard = Math.floor(Math.random() * (1 << board_tiles.length));
  for (var i = 0; i < board_tiles.length; ++i) {
    if (randomBoard & (1 << i)) {
      board_tiles[i].setAttribute('checked', 'checked');
    }
    board_tiles[i].addEventListener("input", function (e) {
      refreshSolution();
    });
  }
  refreshSolution();
}

function refreshBoard() {
  var board_tiles = document.querySelectorAll(".board_tile");
  var size = parseInt(document.querySelector('input[name="size"]:checked').value);
  if (board_tiles.length !== size**2) {
    regenerateBoards(size);
    puzzle_initialize(size);
    refreshSolution();
  }
}

function regenerateBoards(size, avoidHook=false) {
  var board = document.getElementById("board");

  while (board.lastChild) {
    board.removeChild(board.lastChild);
  }

  while (board_solution.lastChild) {
    board_solution.removeChild(board_solution.lastChild);
  }

  for (var j = size - 1; j >= 0; --j) {
    for (var i = 0; i < size; ++i) {
      var chk = document.createElement("input");
      chk.setAttribute('type', 'checkbox');
      chk.setAttribute('id', 'p' + i + j);
      chk.setAttribute('class', 'board_tile');
      if (!avoidHook) {
        chk.addEventListener("input", function (e) {
          refreshSolution();
        });
      }
      board.appendChild(chk);

      chk = document.createElement("input");
      chk.setAttribute('type', 'checkbox');
      chk.setAttribute('id', 's' + i + j);
      chk.setAttribute('class', 'solution_tile');
      chk.setAttribute('tabindex', '-1');
      chk.setAttribute('onclick', 'return false;');
      if (!avoidHook) {
        chk.addEventListener("input", function (e) {
          evt.preventDefault();
        });
      }
      board_solution.appendChild(chk);
    }

    board.appendChild(document.createElement("br"));
    board_solution.appendChild(document.createElement("br"));
  }

  var solutionInfo = document.createElement("div");
  solutionInfo.setAttribute('id', 'solution_info');

  board_solution.appendChild(solutionInfo);

  var uselessInfo = document.createElement("div");
  uselessInfo.setAttribute('id', 'useless_info');
  uselessInfo.style.visibility = 'hidden';
  board.appendChild(uselessInfo);
}

function refreshSolution() {

  //Board into var
  var puzzle_int = 0;
  for (var j = 0; j < g_square_side; ++j) {
    for (var i = 0; i < g_square_side; ++i) {
      if (document.getElementById('p' + i + j).checked)
        puzzle_int += 1 << (j * g_square_side + i);
    }
  }
  console.log("Puzzle is " + puzzle_int);
  //Solve
  var solution_int = puzzle_solve(puzzle_int, 0, 0);
  //Place in solutions
  console.log("Solution is " + solution_int);
  var chkboxes = solution_int;
  if (!solution_int)
    chkboxes = (1 << g_square_side**2) - 1

  var steps = 0;
  for (var i = 0; i < g_square_side**2; ++i) {
    var checked = solution_int && chkboxes & (1 << i);
    var id = 's' + i % g_square_side + Math.floor(i / g_square_side);
    document.getElementById(id).checked = checked;
    document.getElementById(id).indeterminate = !solution_int;

    if (checked)
      steps += 1;
  }

  var solution_info = document.getElementById("solution_info");
  solution_info.innerText = steps ? String(steps) + " steps" : "No solution"

  document.getElementById("useless_info").innerText = "Align";
}


document.addEventListener("DOMContentLoaded", function() {

  addChangeHooks();
  registerKeyUps();

  refreshBoard();
  focusCheckedRadioButton();
});

function addChangeHooks() {
  document.getElementById("s3").addEventListener("input", function (e) {
    refreshBoard();
  });
  document.getElementById("s5").addEventListener("input", function (e) {
    refreshBoard();
  });
  document.getElementById("s3").addEventListener("keydown", function (e) {
    return miniMenuSizeLogic(e);
  });
  document.getElementById("s5").addEventListener("keydown", function (e) {
    return miniMenuSizeLogic(e);
  });
}

function miniMenuSizeLogic(e) {
  if (e.altKey || e.ctrlKey)
    return;

  if (e.key === 'ArrowDown' || e.key === 's') {
    document.getElementById('p0' + (g_square_side - 1)).focus();
    e.preventDefault();
  } else if (e.key === 'd' && e.currentTarget.id === 's3') {
    var elem = document.getElementById('s5');
    elem.focus();
    toggleCheckbox(elem);
    elem.dispatchEvent(new Event("input"));
  } else if (e.key === 'a' && e.currentTarget.id === 's5') {
    var elem = document.getElementById('s3');
    elem.focus();
    toggleCheckbox(elem);
    elem.dispatchEvent(new Event("input"));
  } else {
    return;
  }

  return false;
}

function registerKeyUps() {
  document.addEventListener('keyup', function(e) {
    if (e.ctrlKey)
      return;

    if (e.altKey && e.key === 'r') {
      resetBoard();
      document.getElementById('p0' + (g_square_side - 1)).focus();
    }

    if (!document.activeElement.classList.contains('board_tile'))
      return;

    if (e.altKey)
      return;

    var x = parseInt(document.activeElement.id[1]);
    var y = parseInt(document.activeElement.id[2]);
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        document.getElementById('p' + (x + g_square_side - 1) % g_square_side + y).focus();
        break;
      case 'ArrowRight':
      case 'd':
        document.getElementById('p' + (x + 1) % g_square_side + y).focus();
        break;
      case 'ArrowUp':
      case 'w':
        if (y === g_square_side - 1) {
          focusCheckedRadioButton();
        } else {
          document.getElementById('p' + x + (y + 1)).focus();
        }
        break;
      case 'ArrowDown':
      case 's':
        document.getElementById('p' + x + (y + g_square_side - 1) % g_square_side).focus();
        break;
      case 'Enter':
        document.activeElement.checked = !document.activeElement.checked;
        document.activeElement.dispatchEvent(new Event("input"));
        break;
    }
  });
}

function focusCheckedRadioButton() {
  document.querySelector('input[name="size"]:checked').focus();
}

function toggleCheckbox(checkbox) {
  checkbox.checked = !checkbox.checked;
}
