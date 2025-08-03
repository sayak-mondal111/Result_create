<?php
ini_set('display_errors',1);
error_reporting(E_ALL);

 header('Content-Type: application/json');
 //now connect to the database 

 // 1. Connect to DB
 $conn = new mysqli("localhost","root","","school_result");
 if($conn-> connect_error){
    http_response_code(500);
    echo json_encode(["error"=>"Database connection failed"]);
    exit();
 }

 // 2. Get the student ID from the request
 $class = isset($_GET['class'])? $_GET['class']: "";
 $section = isset($_GET['section'])? $_GET['section']: "";
 $roll = isset($_GET['roll'])? $_GET["roll"]:"";

 if( !$class || !$section|| !$roll){
    http_response_code(400);
    echo json_encode(["error"=> "Fill the data correctly"]);
    exit();
 }

// 3. Query data based on id, class, and section
$sql = "SELECT  id, name, roll , class, section, examType, subject, marks
    FROM result
    WHERE roll = '$roll' AND class = '$class' AND section = '$section' ";

$result = $conn->query($sql);

if($result->num_rows === 0){
    http_response_code(404);
    echo json_encode(["error"=>"No data found."]);
    exit();
}

//4. format of the responce data 
$studentData = [
    "roll" => $roll,
    "subjects" => [] 
];

while ($row = $result->fetch_assoc()){
    if(!isset($studentData['name'])){
        $studentData['id'] = $row['id'];
        $studentData['name']= $row['name'];
        $studentData['class']= $row['class'];
        $studentData['roll']= $row['roll'];
        $studentData['section']= $row['section'];
        $studentData['examType']= $row['examType'];
    }
    $studentData['subjects'][] = [
        "subject" => $row['subject'],
        "marks" => $row['marks']
    ];

}

echo json_encode($studentData);
// 5. Close the connection
$conn->close();
// close the connection to the database
// 6. End the script

?>