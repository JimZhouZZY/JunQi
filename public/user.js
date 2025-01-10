// user.js
async function submitForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try{
        const response = await fetch('/login-register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        const messageElement = document.getElementById('login_message');
        if (response.ok) {
            // Successfully logged in
            messageElement.textContent = data.message; // 显示成功消息
            messageElement.style.color = 'green';
            messageElement.classList.remove('hidden');
            document.getElementById('loginWindow').classList.add('hidden');
            // Save JWT token
            localStorage.setItem('token', data.token);
            // User id
            USERID = await fetchUserId(username);
            USERNAME = username;
            // Update menubar
            updateMenuBar();
        } else {
            messageElement.textContent = data.message; // 显示错误消息
            console.log(messageElement);
            messageElement.style.color = 'red';
            messageElement.classList.remove('hidden');
        }

    } catch (error) {
        console.error('Error:', error);
        messageElement.textContent = 'An error occurred. Please try again.';
        messageElement.style.color = 'red';
        messageElement.classList.remove('hidden');
        console.error('Error:', error); // 处理错误
    }
};

async function checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('User not logged in');
        return;
    }

    const response = await fetch('/protected-route', {
        method: 'GET',
        headers: { 'Authorization': token },
    });
    const data = await response.json()

    if (response.ok) {
        console.log('User is logged in');
        console.log(data)
        return data.user.userId
    } else {
        console.log('Invalid or expired token');
        localStorage.removeItem('token'); // 移除无效的 Token
    }
}

async function fetchUserId(username) {
    const response = await fetch('/get-userid', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
    });
    const data = await response.json();
    return data.userid;
}

async function fetchUserName(userid) {
    const response = await fetch('/get-username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid })
    });
    const data = await response.json();
    return data.username;
}

    const usernameElement = document.getElementById('span_username');
async function updateMenuBar() {
    usernameElement.textContent = USERNAME || 'Guest';

}

USERID = null;
USERNAME = null;
async function main() {
    USERID = await checkLoginStatus();
    if (USERID == null) {
        // If user is not logged in, then show the login window
        // USERID and USERNAME will be define in submitForm
        document.addEventListener("DOMContentLoaded", () => {
            document.getElementById('loginWindow').classList.remove('hidden');
        });
    } else {
        console.log('User ID: ', USERID)
        USERNAME = await fetchUserName(USERID);
    };
    updateMenuBar();
}

main();

