


// _______________________________________________________________________


// Store student data temporarily in memory (just for rendering)
let students = {};

// Handle form submission for adding/updating students
document.getElementById('update-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('studentName').value;
  const roll = document.getElementById('studentRoll').value;
  const id = document.getElementById('studentId').value;
  const studentClass = document.getElementById('studentClass').value;
  const studentSection = document.getElementById('studentSection').value;
  const examType = document.getElementById('examType').value; 
  const subjectInputs = document.querySelectorAll('input[name="subject"]');
  const marksInputs = document.querySelectorAll('input[name="Marks"]');
  let subjectsArr = [];

  for (let i = 0; i < subjectInputs.length; i++) {
    if (subjectInputs[i].value && marksInputs[i].value) {
      subjectsArr.push({
        subject: subjectInputs[i].value,
        marks: parseInt(marksInputs[i].value)
      });
    }
  }
  

  // Send to PHP backend using fetch
  fetch('insert.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
      body: JSON.stringify({
    name,
    roll,
    id,
    class: studentClass,
    section: studentSection,
    examType, // ✅ must be here
    subjects: subjectsArr
  })

  })
    .then(res => res.text())
    .then(data => {
       alert(data); 
      // Optionally fetch latest student data if needed
     // fetchStudentById(id);
      displayResult({
        name,
        roll,
        id,
        class: studentClass,
        section: studentSection,
        examType, // Include exam type in the result display
        subjects: subjectsArr
      });    //this show the result immediately after submission bcz still not create the fetch part
     
    })
    .catch(err => {
      console.error("Error:", err);
    });

  this.reset();
  document.getElementById('subject-container').innerHTML = '';
});

// Add subject/marks input row
document.getElementById("submit-btn1").addEventListener('click', () => {
  const container = document.getElementById("subject-container");

  const newEle = document.createElement("div");
  newEle.className = "subject-row";

  const newSubject = document.createElement("input");
  newSubject.type = "text";
  newSubject.name = "subject";
  newSubject.placeholder = "Subject";
  newSubject.required = true;

  const newMarks = document.createElement("input");
  newMarks.type = "text";
  newMarks.name = "Marks";
  newMarks.placeholder = "Marks";
  newMarks.required = true;

  newEle.appendChild(newSubject);
  newEle.appendChild(newMarks);
  container.appendChild(newEle);
});

// Search form submit
document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const searchClass = document.getElementById('searchClass').value.trim();
  const searchSection = document.getElementById('searchSection').value.trim();
  const searchRoll = document.getElementById('searchRoll').value.trim();
  if (searchClass && searchSection&& searchRoll ) {
    fetchStudentByDetails(searchClass ,  searchSection, searchRoll);
  } else{
    alert("please give all the details about the student")
  }
});

// Fetch student from backend by ID or Roll
function fetchStudentByDetails(searchClass,searchSection ,searchRoll   ){
  fetch(`fetch_student.php?class=${searchClass}&section=${searchSection}&roll=${searchRoll}`)
  .then(res =>{
    if (!res.ok) throw new Error("student not found");
    return res.json();
  })
  .then(data => displayResult(data) )
  .catch(err=>{
    console.error("Fetch error:",err);
    alert("please check the details you entered");
  })
}

// Display student result
function displayResult(student) {
  const resultDiv = document.getElementById('result-display');
  resultDiv.innerHTML = '';

  let html = `<div class="student-result">
    <h3>School: ABC School</h3>
    <p><strong>Name:</strong> ${student.name}</p>
    <p><strong>Roll No:</strong> ${student.roll}</p>
    <p><strong>ID:</strong> ${student.id}</p>
    <p><strong>Class:</strong> ${student.class}</p>
    <p><strong>Section:</strong> ${student.section}</p>
    <p><strong>Exam Type:</strong> ${student.examType}</p>
    <table border="1" cellpadding="10" cellspacing="0">
      <thead><tr><th>Subject</th><th>Marks</th></tr></thead>
      <tbody>`;

  let total = 0;
  student.subjects.forEach(sub => {
    html += `<tr><td>${sub.subject}</td><td>${sub.marks}</td></tr>`;
    total += parseInt(sub.marks);
  });

  const percentage = (total / (student.subjects.length * 100)) * 100;

  html += `</tbody></table>
    <p><strong>Total Marks:</strong> ${total}</p>
    <p><strong>Percentage:</strong> ${percentage.toFixed(2)}%</p>
    <button onclick="deleteStudent('${student.id}')">Delete Student</button>
    <br><hr></div>`;

  resultDiv.innerHTML = html;
}

// Delete student from database
function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    fetch('delete_student.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })  
    })
      .then(res => res.text())
      .then(data => {
         alert(data); 
        document.getElementById('result-display').innerHTML = '';
      })
      .catch(err => console.error("Delete error:", err));
  }
}

// Download PDF
function downloadPDF() {
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Result PDF</title>');
  printWindow.document.write('<style>body{font-family:sans-serif;} table{border-collapse:collapse;width:100%;} table,th,td{border:1px solid black;padding:8px;text-align:left;} h3, p { margin: 5px 0; }</style>');
  printWindow.document.write('</head><body>');
  printWindow.document.write('<h1>ABC School - Full Result</h1>');
  let cloned = document.getElementById('result-display').cloneNode(true);
  cloned.querySelectorAll('button').forEach(btn => btn.remove());
  printWindow.document.write(cloned.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}

// Clear result display when page loads
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('result-display').innerHTML = '';
});

// Add event listener for download PDF button