var g_last_esc_time = new Date() * 1;
var g_esc_count = 0;
document.addEventListener('keyup', function(e) {
  if (e.altKey || e.ctrlKey)
    return;

  if (e.key !== 'Escape')
    return;
    
  var currentTime = new Date() * 1;
  //2 times in 0.667 sec
  if (currentTime > g_last_esc_time + 667) {
    g_last_esc_time = currentTime;
    g_esc_count = 0;
  }
  g_esc_count += 1;
  if (g_esc_count >= 2) {
    window.location.href = "hohtools.html";
  }
});