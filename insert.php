<?php
include 'database.php';
//add the database connection file

//  Get the JSON data sent from frontend
$data = json_decode(file_get_contents("php://input"), true);

// Debug: Log received data
error_log("Received data: " . print_r($data, true));

//  Store the data into PHP variables
$id = $data['id'];
$name = $data['name'];
$roll = $data['roll'];
$class = isset($data['class']) ? $data['class'] : '';
$section = isset($data['section']) ? $data['section'] : '';
$examType = isset($data['examType']) ? $data['examType'] : ''; // Added exam type
$subjects = $data['subjects']; // array of {subject, marks}
$success = true;

foreach ($subjects as $subj){
    $subject = $subj['subject'];
    $marks = $subj['marks'];
 // now write the sql query to insert the data into the database
    $sql = "INSERT INTO result(id, name, roll, class, section, examType, subject, marks) 
    values('$id','$name','$roll','$class','$section','$examType','$subject','$marks')";
    if(!$conn->query($sql)){
        $success = false;
        break;
    }
    
}


   
   

    // // now to check if the query is executed successfully or not
    // if ($conn->query($sql)=== TRUE){
    //     echo("Done");
    // } else {
    //     echo "Error:" . $conn-> error;
    // }
    // // if the data save in database then it show the success message
    // // else it show the error message
   if ($success) 
    {
    echo("Data submit successfully.");
} 
else {
    http_response_code(500);
    echo("error:" . $conn->error);
}


$conn->close();
// close the connection to the database
?>