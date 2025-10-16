import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { router } from 'expo-router'; 
import { API_URL } from '@env';


const api = axios.create({
    baseURL: API_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    async (config) => {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            try {
                const refreshToken = await SecureStore.getItemAsync('refreshToken');
                if (!refreshToken) throw new Error('No refresh token available');


                const reissueResponse = await axios.post(`${API_URL}/api/reissue`, {
                    refreshToken: refreshToken,
                });
                

                const { accessToken: newAccessToken } = reissueResponse.data.data;

                await SecureStore.setItemAsync('accessToken', newAccessToken);


                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;


                return api(originalRequest);

            } catch (reissueError) {
                console.error("Token reissue failed:", reissueError);
                
                await SecureStore.deleteItemAsync('accessToken');
                await SecureStore.deleteItemAsync('refreshToken');

                Alert.alert("세션이 만료되었습니다", "다시 로그인해주세요.");
                
                router.replace('/login');
                
                return Promise.reject(reissueError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;