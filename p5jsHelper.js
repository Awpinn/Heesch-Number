function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        if (dostuffthing.length > 0) {
            startingIndex = (startingIndex - 1 + dostuffthing.length) % dostuffthing.length;
        } else if (allValid.length > 0) {
            startingIndex = (startingIndex - 1 + allValid.length) % allValid.length;
        }
    } else if (keyCode === RIGHT_ARROW) {
       if (dostuffthing.length > 0) {
            startingIndex = (startingIndex + 1) % dostuffthing.length;
        } else if (allValid.length > 0) {
            startingIndex = (startingIndex + 1) % allValid.length;            
        }
    }
  }