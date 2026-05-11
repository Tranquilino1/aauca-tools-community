import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
});

export const chatWithPDF = async (question: string, fileId?: string) => {
  const response = await api.post('/chat', { question, file_id: fileId });
  return response.data;
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const summarizeBook = async (fileName: string) => {
  const response = await api.post('/summarize', null, { params: { file_name: fileName } });
  return response.data;
};

export const transcribeAudio = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
