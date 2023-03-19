const changeRowsCols = document.getElementById('set-rowsCols'); //자리 생성 버튼
const rowsInput = document.getElementById('rows-input'); //열 입력 값
const colsInput = document.getElementById('cols-input'); //행 입력 값
const studentNamesInput = document.getElementById('students-input'); //학생 명단 입력
const assignStudentsBtn = document.getElementById('assign-students'); //책상 배치 버튼
const seatingTable = document.getElementById('tableContainer');

const line4 = document.getElementById('line4'); //책상 배치 후 부연 설명
line4.style.display = "none";

let alreadyTable = false; //테이블을 생성해야하나?
let unavailableMode = true; //앉지 못하는 자리의 수정이 가능한가?
let editMode = false; //테이블 생성 후 자리 교환이 가능한 상태인가?

let selectedCell = null;

//자리 생성 버튼이 눌렸을 때 이벤트
changeRowsCols.addEventListener('click', () => {
  selectedCell = null; //자리 교환을 위해 입력된 값이 있다면 지워준다.

  if(alreadyTable){ //테이블이 이미 있다면 있는 테이블은 삭제 한다.
    const table = document.getElementById("dynamicTable");
    table.remove();
    unavailableMode = true;
    editMode = false;
  } 
  // Create table
  const table = document.createElement("table");
  const colGap = parseInt(document.getElementById('col-gap-input').value); //행 건너띄기 간격
  table.id = "dynamicTable";
  table.classList.add("centered-table"); // 클래스 추가
  rows = rowsInput.value;
  cols = colsInput.value;

  
  for (let row = 0; row < rows; row++) {
    const tableRow = document.createElement('tr');
    table.appendChild(tableRow);
    let colsMax = parseInt(cols) + parseInt(Math.trunc((cols-1) / colGap));
    for (let col = 0; col < colsMax; col++) {
      const tableCell = document.createElement('td');
      tableRow.appendChild(tableCell);
      if (col % (colGap + 1) === colGap) {
        tableCell.classList.add('unavailable');
      }
    }
  }
  

  /*
  for (let row = 0; row < rows; row++) {
    const tableRow = document.createElement('tr');
    table.appendChild(tableRow);
    for (let col = 0; col < cols; col++) {
      const tableCell = document.createElement('td');
      tableRow.appendChild(tableCell);
    }
  }
  */
  

  //tableContainer에 생성한 테이블을 담는다.
  document.getElementById("tableContainer").appendChild(table);
  alreadyTable = true;
  //현재 사용 가능한 좌석의 수를 알려준다.
  displayAvailableCellsNum();
});

function displayAvailableCellsNum(){ //현재 앉을 수 있는 좌석의 수를 화면에 표시
  const kTable = document.getElementById("dynamicTable");
  const kAvailableCells = Array.from(kTable.querySelectorAll('td:not(.unavailable)'));
  kAvailableCells.forEach(cell => cell.textContent = '');
  kNum = kAvailableCells.length;
  const kstudentNames = studentNamesInput.value.split(',').map(name => name.trim()); //학생명렬 업데이트
  const nonNullStudentsCount = kstudentNames.filter(element => element !== "").length;

  const seatsLabel = document.getElementById("seatsLabel");
  seatsLabel.textContent = "현재 앉을 수 있는 좌석 수: " + kNum + "개";
  const studentsLabel = document.getElementById("studentsLabel");
  studentsLabel.textContent = "현재 입력된 학생 수: " + nonNullStudentsCount + "명";
}

//자리 배치 버튼이 눌렸을 때 이벤트
assignStudentsBtn.addEventListener('click', () => {
  const kTable = document.getElementById("dynamicTable");
  let studentNames = studentNamesInput.value.split(',').map(name => name.trim());
  const availableCells = Array.from(kTable.querySelectorAll('td:not(.unavailable)'));

  //학생 명렬에서 값이 ""인 것은 제거하여 없앤다.
  let fillterStudentNames = studentNames.filter(element => element !== "");
  studentNames = fillterStudentNames;

  unavailableMode = false; //앉지 못하는 자리의 수정이 불가능하도록 한다.
  editMode = true; //자리 교환이 가능한 상태로 변경한다.
  line4.style.display = "block" //자리 배치 후 부연 설명을 나타나도록 한다.

  // Shuffle student names
  for (let i = studentNames.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [studentNames[i], studentNames[j]] = [studentNames[j], studentNames[i]];
  }
  
  availableCells.forEach(cell => cell.textContent = '');
  
  if (studentNames.length > availableCells.length) {
    alert('자리가 부족합니다. 더 많은 자리를 활성화해 주세요.');
    unavailableMode = true;
    return;
  }

  studentNames.forEach((name, index) => {
    if (index < availableCells.length) {
      availableCells[index].textContent = name;
    }
  });
});

//학생 자리의 셀을 클릭했을 때 나타나는 행동
seatingTable.addEventListener('click', (event) => {
  event.stopPropagation();
  const cell = event.target;
  if (cell.tagName === 'TD') {
    if (unavailableMode) {
      cell.classList.toggle('unavailable');
      //현재 사용 가능한 좌석의 수가 변하였으므로 이를 알려준다.
      displayAvailableCellsNum();
    } else if (editMode) {
      if (selectedCell === null) {
        selectedCell = cell;
        selectedCell.classList.toggle('changeable');
      } else {
        selectedCell.classList.toggle('changeable');
        [cell.textContent, selectedCell.textContent] = [selectedCell.textContent, cell.textContent];
        selectedCell = null;
      }
    }
  }
});

//학생 명렬에 입력 받은 곳에 값이 변할 때 이를 알려준다.
document.getElementById("students-input").addEventListener("input", function() {
    //현재 사용 가능한 좌석의 수가 변하였으므로 이를 알려준다.
    displayAvailableCellsNum();
});

document.getElementById('download').addEventListener('click', () => {
  const screenContainer = document.getElementById('screenContainer');
  html2canvas(screenContainer).then((canvas) => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'seat.png';
    link.click();
  });
});