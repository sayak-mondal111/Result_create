<?php
include 'database.php';

//set headers for json response
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

//check if id is provided or nor 
if (!isset($data['id']) || empty($data['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Student id required"]);
    exit();
}

$id = $data['id'];
//write the sql query 
$sql = "DELETE FROM result WHERE ID = '$id'";
//checking with the sql query 
if ($conn->query($sql) === true) {
    echo json_encode(["message" => "Data deleted successfully."]);
} else {
    echo json_encode(["error" => "Failed to delete the data." . $conn->error]);
    exit();
}
$conn->close();
