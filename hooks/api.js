import axios from 'axios';
import { API_URL } from '../constants/config';

const baseUrl = API_URL;

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

export function createTask(data, accessToken) {
    return axios.post(`${baseUrl}/task`, data, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
}

export async function updateTask(taskId, data, accessToken) {
    return axios.patch(`${baseUrl}/task/${taskId}`, data, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
}

export function deleteTask(taskId, accessToken) {
    return axios.delete(`${baseUrl}/task/${taskId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
}

export function deleteSupporterFromCircle(
    circleId,
    supporterUserId,
    accessToken
) {
    return axios.delete(
        `${baseUrl}/users/circles/${circleId}/supporters/${supporterUserId}`,
        {
            headers: { Authorization: `Bearer ${accessToken}` }
        }
    );
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
    return axios.patch(`${baseUrl}/task/${taskId}/assign`, null, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
}

export function unassingUserToTask(taskId, accessToken) {
    return axios.patch(`${baseUrl}/task/${taskId}/unassign`, null, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
}

export function changeUserCircle(
    leadUserId,
    supporterUserId,
    newCircle,
    accessToken
) {
    return axios.patch(
        `${baseUrl}/users/${leadUserId}/supporters/${supporterUserId}/circles`,
        { newCircleLevels: [newCircle] },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
}

export function getNotificationsForUser(userId, accessToken) {
    return axios.get(`${baseUrl}/notifications/${userId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
}

export async function markAsRead(notificationId, accessToken) {
    return axios.patch(
        `${baseUrl}/notifications/${notificationId}/read`,
        null,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
}

export async function deleteUser(userId, accessToken) {
    return axios.delete(`${baseUrl}/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
}
