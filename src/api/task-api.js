export async function getTasks() {
  const response = await fetch("http://192.168.0.14:8080/api/tasks");
  const json = await response.json();
  return json;
}

export async function postTasks(tasks) {
  const response = await fetch("http://192.168.0.14:8080/api/tasks", {
    headers: {
      "Content-type": "application/json",
    },
    method: "post",
    body: JSON.stringify({ tasks: tasks }),
  });
  if (response.status === 204) {
    return true;
  } else {
    return false;
  }
}
