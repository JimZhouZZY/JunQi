export async function fetchUserId(username: string) {
  const response = await fetch("/users/get-userid-by-username", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  const data = await response.json();
  return data.userid;
}

export async function fetchUserName(userid: string | number) {
  const response = await fetch("/users/get-username-by-userid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userid }),
  });
  const data = await response.json();
  return data.username;
}
