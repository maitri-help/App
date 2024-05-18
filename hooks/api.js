import axios from 'axios';

const baseUrl = 'http://52.19.91.67:3000';

export function resendOtp(phoneNumber) {
    return axios.post(`${baseUrl}/auth/otp/resend`, { phoneNumber });
}

export function sendOtp(phoneNumber) {
    return axios.post(`${baseUrl}/auth/otp/send`, { phoneNumber });
}

export function verifyOtp(phoneNumber, otp) {
    return axios.post(`${baseUrl}/auth/otp/verify`, { phoneNumber, otp });
}

export function getUser(phoneNumber) {
    return axios.get(`${baseUrl}/users/${phoneNumber}`);
}

export function getLeadUser(accessToken) {
    return axios.get(`${baseUrl}/users/supporter/lead-user`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
}

export function createUser(data) {
    return axios.post(`${baseUrl}/users`, data);
}

export function updateUserType(userId, userType) {
    return axios.patch(`${baseUrl}/users/${userId}/user/type`, { userType });
}

export function joinTribe(userId, tribeCode) {
    return axios.post(`${baseUrl}/users/${userId}/join/tribe`, { tribeCode });
}

export function createTask(data, header) {
    return axios.post(`${baseUrl}/task`, data, header);
}

export function updateTask(data, header, taskId) {
    return axios.patch(`${baseUrl}/task/${taskId}`, data, header).then(response => {
        console.log('Task updated successfully:', response.data);
        return response.data;
    })
        .catch(error => {
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
                throw new Error(`Server responded with status code ${error.response.status}: ${error.response.data.message}`);
            } else if (error.request) {
                console.error('Error request:', error.request);
                throw new Error('No response was received from the server');
            } else {
                console.error('Error message:', error.message);
                throw new Error('Error in setting up the request: ' + error.message);
            }
        });
}

export function deleteTask(header, taskId) {
    return axios.delete(`${baseUrl}/task/${taskId}`, header);
}

export function deleteSupporterFromCircle(header, circleId, supporterUserId) {
    return axios.delete(`${baseUrl}/users/circles/${circleId}/supporters/${supporterUserId}`, header);
}

export function getTasksForUser(userId, accessToken) {
    return axios.get(`${baseUrl}/task/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
}

export function circlesUsers(accessToken) {
    return axios.get(`${baseUrl}/users/circles-users`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
}

export function updateUser(userId, data, accessToken) {
    return axios.patch(`${baseUrl}/users/${userId}`, data, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
}

export function assingUserToTask(taskId, accessToken) {
    return axios.patch(`${baseUrl}/task/${taskId}/assign`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
}