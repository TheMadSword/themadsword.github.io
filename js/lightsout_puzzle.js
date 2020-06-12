var g_pos_fx;
var g_all_lights;
var g_square_side;

/*
  do line by line, column by column
  current_board = int representation of board
  tiles_pressed = bits of tiles being pressed, solution being built
  current_tile = 0..nb_tile - 1
*/
function puzzle_solve(current_board, tiles_pressed, current_tile) {
  if (current_board == g_all_lights)
    return tiles_pressed;

  if (current_tile >= g_pos_fx.size)
    return false;

  var retval = false;

  //do nothing hypothesis
  if (check_below_ok(current_board, current_tile))
    retval = puzzle_solve(current_board, tiles_pressed, current_tile + 1);

  //activate hypothesis
  var press_current_tile_hypothesis = current_board ^ g_pos_fx[current_tile]
  if (!retval && check_below_ok(press_current_tile_hypothesis, current_tile))
    retval = puzzle_solve(press_current_tile_hypothesis, tiles_pressed | (1 << current_tile), current_tile + 1);

  return retval;
}

function puzzle_initialize(square_side) {
  generate_pos_fx(square_side);
  g_all_lights = 2**(square_side**2) - 1;
  g_square_side = square_side;
}


function generate_pos_fx(side) {
  g_pos_fx = []
  for (var i = 0; i < side**2; ++i) {
    var x = i % side;
    var y = Math.floor(i / side);

    var pos = 0;
    pos += 1 << i;
    if (x > 0)
      pos += 1 << i - 1;
    if (x < side - 1)
      pos += 1 << i + 1;
    if (y > 0)
      pos += 1 << i - side;
    if (y < side - 1)
      pos += 1 << i + side;

    g_pos_fx.push(pos);
  }
}

function check_below_ok(current_board, current_tile) {
  if (current_tile < g_square_side)
    return true;

  var all_below_tiles_on = 1 << (current_tile - g_square_side + 1) - 1

  return (all_below_tiles_on & current_board) == all_below_tiles_on
}
