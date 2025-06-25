const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');

const genderButtons = document.querySelectorAll('.gender-btn');
const toUploadBtn = document.getElementById('toUploadBtn');
const uploadSelectedBtn = document.getElementById('uploadSelectedBtn');
const submitBtn = document.getElementById('submitBtn');

const frontCheck = document.getElementById('frontCheck');
const sideCheck = document.getElementById('sideCheck');
const topCheck = document.getElementById('topCheck');
const backCheck = document.getElementById('backCheck');

const frontPhoto = document.getElementById('frontPhoto');
const sidePhoto = document.getElementById('sidePhoto');
const topPhoto = document.getElementById('topPhoto');
const backPhoto = document.getElementById('backPhoto');

const heightInput = document.getElementById('heightInput');

const errorMsg = document.getElementById('errorMsg');
const sizeResult = document.getElementById('sizeResult');

const progressSteps = document.querySelectorAll('.progress-step');
const progressLines = document.querySelectorAll('.progress-line');

let selectedGender = null;

function showStep(from, to) {
  // Hide next step immediately
  to.style.display = 'none';
  to.classList.remove('active');

  from.classList.add('slide-out');

  setTimeout(() => {
    from.classList.remove('slide-out');
    from.classList.remove('active');
    from.style.display = 'none';

    // Wait 1 second with just background visible before showing next step
    setTimeout(() => {
      to.style.display = 'block';
      to.classList.add('slide-in');
      to.classList.add('active');

      setTimeout(() => {
        to.classList.remove('slide-in');
      }, 500);
    }, 1000);

  }, 500);
}

genderButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedGender = btn.getAttribute('data-gender');
    updateProgressBar(2);
    showStep(step1, step2);
  });
});

toUploadBtn.addEventListener('click', () => {
  errorMsg.textContent = '';

  if (!frontCheck.checked || !sideCheck.checked) {
    errorMsg.textContent = 'Front and Side photos are required. Please select both.';
    return;
  }

  updateProgressBar(3);
  showStep(step2, step3);
});

uploadSelectedBtn.addEventListener('click', () => {
  errorMsg.textContent = '';

  const photosToUpload = [];
  if (frontCheck.checked) photosToUpload.push({input: frontPhoto, name: 'Front'});
  if (sideCheck.checked) photosToUpload.push({input: sidePhoto, name: 'Side'});
  if (topCheck.checked) photosToUpload.push({input: topPhoto, name: 'Top'});
  if (backCheck.checked) photosToUpload.push({input: backPhoto, name: 'Back'});

  function uploadNext(index) {
    if (index >= photosToUpload.length) return;

    const current = photosToUpload[index];
    current.input.click();

    current.input.onchange = () => {
      if (!current.input.files.length) {
        errorMsg.textContent = `Upload canceled for ${current.name} photo.`;
        return;
      }
      uploadNext(index + 1);
    };
  }

  uploadNext(0);
});

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  errorMsg.textContent = '';
  sizeResult.textContent = '';

  if (!selectedGender) {
    errorMsg.textContent = 'Please select your gender first.';
    return;
  }

  if (!heightInput.value) {
    errorMsg.textContent = 'Please enter your height.';
    heightInput.focus();
    return;
  }

  if (!frontPhoto.files.length) {
    errorMsg.textContent = 'Please upload your Front View photo.';
    return;
  }

  if (!sidePhoto.files.length) {
    errorMsg.textContent = 'Please upload your Side View photo.';
    return;
  }

  const height = parseInt(heightInput.value);
  let size = 'Unknown';

  if (height < 150) size = 'XS';
  else if (height < 160) size = 'S';
  else if (height < 170) size = 'M';
  else if (height < 180) size = 'L';
  else if (height < 190) size = 'XL';
  else size = 'XXL';

  sizeResult.textContent = `✅ Recommended Size Based on Height: ${size}`;
  alert(`Gender: ${selectedGender}\nSize: ${size}\nThanks for submitting!`);
});

function updateProgressBar(step) {
  progressSteps.forEach((circle, idx) => {
    circle.classList.toggle('active', idx < step);
  });

  progressLines.forEach((line, idx) => {
    line.classList.toggle('active', idx < step - 1);
  });

  const line = progressLines[step - 2];
  if (line) {
    line.classList.add('transitioning');
    setTimeout(() => line.classList.remove('transitioning'), 1000);
  }
}

window.addEventListener('load', () => {
  const container = document.querySelector('.container');
  container.classList.add('animate-drop');

  setTimeout(() => {
    container.classList.remove('animate-drop');
    container.style.animation = 'floatUpDown 4s ease-in-out infinite';
  }, 800);
});
